// ==============================================================================
// SUPABASE CLIENT INTEGRATION - PRAGNYA ICSE STUDY TRACKER
// ==============================================================================
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SAMPLE_STUDY_SESSIONS, SAMPLE_MOCK_MARKS } from './data.js';

const STORAGE_KEYS = {
  URL: 'pragnya_study_supabase_url',
  KEY: 'pragnya_study_supabase_key',
  LOCAL_SESSIONS: 'pragnya_study_sessions_cache',
  LOCAL_MARKS: 'pragnya_mock_marks_cache',
  ACTIVE_TIMER: 'pragnya_active_study_timer'
};

// Seed local storage with initial sample data if empty
function initializeLocalStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.LOCAL_SESSIONS)) {
    localStorage.setItem(STORAGE_KEYS.LOCAL_SESSIONS, JSON.stringify(SAMPLE_STUDY_SESSIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LOCAL_MARKS)) {
    localStorage.setItem(STORAGE_KEYS.LOCAL_MARKS, JSON.stringify(SAMPLE_MOCK_MARKS));
  }
}
initializeLocalStorage();

export let supabaseUrl = localStorage.getItem(STORAGE_KEYS.URL) || '';
export let supabaseKey = localStorage.getItem(STORAGE_KEYS.KEY) || '';
export let supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export function isSupabaseConnected() {
  return !!supabase;
}

export function getSupabaseConfig() {
  return {
    url: supabaseUrl,
    key: supabaseKey,
    isConnected: !!supabase
  };
}

export function saveSupabaseConfig(url, key) {
  supabaseUrl = (url || '').trim();
  supabaseKey = (key || '').trim();

  if (supabaseUrl && supabaseKey) {
    localStorage.setItem(STORAGE_KEYS.URL, supabaseUrl);
    localStorage.setItem(STORAGE_KEYS.KEY, supabaseKey);
    try {
      supabase = createClient(supabaseUrl, supabaseKey);
    } catch (e) {
      console.error("Error creating Supabase client:", e);
      supabase = null;
    }
  } else {
    localStorage.removeItem(STORAGE_KEYS.URL);
    localStorage.removeItem(STORAGE_KEYS.KEY);
    supabase = null;
  }
}

export function clearSupabaseConfig() {
  localStorage.removeItem(STORAGE_KEYS.URL);
  localStorage.removeItem(STORAGE_KEYS.KEY);
  supabaseUrl = '';
  supabaseKey = '';
  supabase = null;
}

// Test live connection to verify credentials and table existence
export async function testConnection(url, key) {
  try {
    const testClient = createClient(url.trim(), key.trim());
    const { data, error } = await testClient
      .from('study_sessions')
      .select('id')
      .limit(1);

    if (error) {
      // Check if table missing
      if (error.code === '42P01' || error.message.includes('relation "public.study_sessions" does not exist')) {
        return {
          success: false,
          error: "Connected to Supabase, but table 'study_sessions' is missing! Please run the SQL schema script in your Supabase SQL Editor."
        };
      }
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message || "Failed to reach Supabase project" };
  }
}

// ==============================================================================
// STUDY SESSIONS API (Subject-wise, Day-wise Time Logging)
// ==============================================================================

export async function fetchStudySessions() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .order('study_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Update local cache
      localStorage.setItem(STORAGE_KEYS.LOCAL_SESSIONS, JSON.stringify(data));
      return data || [];
    } catch (err) {
      console.warn("Supabase fetch failed; falling back to local storage cache:", err);
    }
  }

  // Fallback to local storage
  const localData = localStorage.getItem(STORAGE_KEYS.LOCAL_SESSIONS);
  return localData ? JSON.parse(localData) : SAMPLE_STUDY_SESSIONS;
}

export async function addStudySession(session) {
  const newSession = {
    ...session,
    id: session.id || ('sess-' + Date.now()),
    created_at: new Date().toISOString()
  };

  // Always update local cache immediately for instant UI responsiveness
  const current = getLocalSessions();
  const updated = [newSession, ...current];
  localStorage.setItem(STORAGE_KEYS.LOCAL_SESSIONS, JSON.stringify(updated));

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .insert([{
          student_name: newSession.student_name || 'Pragnya',
          subject: newSession.subject,
          chapter_topic: newSession.chapter_topic,
          duration_minutes: Number(newSession.duration_minutes),
          study_date: newSession.study_date,
          study_type: newSession.study_type || 'Self Study',
          efficiency_rating: Number(newSession.efficiency_rating || 5),
          notes: newSession.notes || ''
        }])
        .select();

      if (error) throw error;
      if (data && data[0]) {
        // Replace temporary local ID with Supabase UUID if returned
        const synced = updated.map(item => item.id === newSession.id ? data[0] : item);
        localStorage.setItem(STORAGE_KEYS.LOCAL_SESSIONS, JSON.stringify(synced));
        return data[0];
      }
    } catch (err) {
      console.error("Supabase insert failed (saved locally):", err);
    }
  }

  return newSession;
}

export async function deleteStudySession(id) {
  // Remove from local cache
  const current = getLocalSessions();
  const updated = current.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEYS.LOCAL_SESSIONS, JSON.stringify(updated));

  if (supabase) {
    try {
      const { error } = await supabase
        .from('study_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error("Supabase delete failed:", err);
    }
  }
}

function getLocalSessions() {
  const localData = localStorage.getItem(STORAGE_KEYS.LOCAL_SESSIONS);
  return localData ? JSON.parse(localData) : [];
}

// ==============================================================================
// MOCK PAPER & MARKS API
// ==============================================================================

export async function fetchMockMarks() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('mock_paper_entries')
        .select('*')
        .order('test_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      localStorage.setItem(STORAGE_KEYS.LOCAL_MARKS, JSON.stringify(data));
      return data || [];
    } catch (err) {
      console.warn("Supabase mock marks fetch failed; fallback to local storage:", err);
    }
  }

  const localData = localStorage.getItem(STORAGE_KEYS.LOCAL_MARKS);
  return localData ? JSON.parse(localData) : SAMPLE_MOCK_MARKS;
}

export async function addMockMark(entry) {
  const maxMarks = Number(entry.max_marks || 80);
  const marksObt = Number(entry.marks_obtained);
  const percentage = Number(((marksObt / maxMarks) * 100).toFixed(2));

  const newEntry = {
    ...entry,
    id: entry.id || ('mock-' + Date.now()),
    max_marks: maxMarks,
    marks_obtained: marksObt,
    percentage: percentage,
    created_at: new Date().toISOString()
  };

  const current = getLocalMarks();
  const updated = [newEntry, ...current];
  localStorage.setItem(STORAGE_KEYS.LOCAL_MARKS, JSON.stringify(updated));

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('mock_paper_entries')
        .insert([{
          student_name: newEntry.student_name || 'Pragnya',
          subject: newEntry.subject,
          paper_name: newEntry.paper_name,
          test_date: newEntry.test_date,
          marks_obtained: marksObt,
          max_marks: maxMarks,
          percentage: percentage,
          time_taken_minutes: newEntry.time_taken_minutes ? Number(newEntry.time_taken_minutes) : null,
          weak_areas: newEntry.weak_areas || '',
          strong_areas: newEntry.strong_areas || '',
          notes: newEntry.notes || ''
        }])
        .select();

      if (error) throw error;
      if (data && data[0]) {
        const synced = updated.map(item => item.id === newEntry.id ? data[0] : item);
        localStorage.setItem(STORAGE_KEYS.LOCAL_MARKS, JSON.stringify(synced));
        return data[0];
      }
    } catch (err) {
      console.error("Supabase insert mock paper failed (saved locally):", err);
    }
  }

  return newEntry;
}

export async function deleteMockMark(id) {
  const current = getLocalMarks();
  const updated = current.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEYS.LOCAL_MARKS, JSON.stringify(updated));

  if (supabase) {
    try {
      const { error } = await supabase
        .from('mock_paper_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error("Supabase delete mock paper failed:", err);
    }
  }
}

function getLocalMarks() {
  const localData = localStorage.getItem(STORAGE_KEYS.LOCAL_MARKS);
  return localData ? JSON.parse(localData) : [];
}

// Reset data back to initial sample state
export function resetToSampleData() {
  localStorage.setItem(STORAGE_KEYS.LOCAL_SESSIONS, JSON.stringify(SAMPLE_STUDY_SESSIONS));
  localStorage.setItem(STORAGE_KEYS.LOCAL_MARKS, JSON.stringify(SAMPLE_MOCK_MARKS));
}
