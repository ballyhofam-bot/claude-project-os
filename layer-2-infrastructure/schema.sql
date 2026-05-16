-- Run this in the D1 console to create all tables

CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT,
  priority TEXT DEFAULT 'Medium',
  status TEXT DEFAULT 'todo',
  assignee_id INTEGER,
  source TEXT DEFAULT 'manual',
  tags TEXT,
  notes TEXT,
  ai_extracted INTEGER DEFAULT 0,
  source_label TEXT,
  source_meeting_id TEXT,
  ownership TEXT DEFAULT 'mine',
  waiting_on TEXT,
  knowledge_type TEXT,
  target_period TEXT,
  completed_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS people (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  department TEXT,
  area TEXT,
  expertise TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS leadership_moves (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'proactive',
  context TEXT,
  people_involved TEXT,
  source_label TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
