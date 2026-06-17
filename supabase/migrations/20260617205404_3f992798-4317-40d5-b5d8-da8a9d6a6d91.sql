-- Seed SSC Physics curriculum
INSERT INTO public.curriculum_topics (slug, class_level, subject, chapter, skill, display_name) VALUES
  ('ssc.physics.motion',          'SSC', 'Physics', 'Motion',              'kinematics',     'Motion & Kinematics'),
  ('ssc.physics.newtons-laws',    'SSC', 'Physics', 'Force',               'dynamics',       'Newton''s Laws of Motion'),
  ('ssc.physics.momentum',        'SSC', 'Physics', 'Force',               'momentum',       'Momentum & Impulse'),
  ('ssc.physics.work-energy',     'SSC', 'Physics', 'Work, Power, Energy', 'energy',         'Work, Power & Energy'),
  ('ssc.physics.pressure',        'SSC', 'Physics', 'Pressure',            'fluids',         'Pressure in Fluids'),
  ('ssc.physics.archimedes',      'SSC', 'Physics', 'Pressure',            'buoyancy',       'Archimedes'' Principle'),
  ('ssc.physics.heat',            'SSC', 'Physics', 'Heat',                'thermal',        'Heat & Temperature'),
  ('ssc.physics.waves',           'SSC', 'Physics', 'Waves & Sound',       'waves',          'Waves & Sound'),
  ('ssc.physics.reflection',      'SSC', 'Physics', 'Light',               'optics',         'Reflection of Light'),
  ('ssc.physics.refraction',      'SSC', 'Physics', 'Light',               'optics',         'Refraction of Light'),
  ('ssc.physics.current',         'SSC', 'Physics', 'Electricity',         'circuits',       'Electric Current & Ohm''s Law'),
  ('ssc.physics.magnetism',       'SSC', 'Physics', 'Electromagnetism',    'magnetism',      'Magnetism & Electromagnetism')
ON CONFLICT (slug) DO NOTHING;

-- Prerequisite graph
WITH t AS (SELECT slug, id FROM public.curriculum_topics)
INSERT INTO public.topic_prerequisites (topic_id, prerequisite_topic_id)
SELECT a.id, b.id FROM t a, t b WHERE (a.slug, b.slug) IN (
  ('ssc.physics.newtons-laws',  'ssc.physics.motion'),
  ('ssc.physics.momentum',      'ssc.physics.newtons-laws'),
  ('ssc.physics.work-energy',   'ssc.physics.newtons-laws'),
  ('ssc.physics.archimedes',    'ssc.physics.pressure'),
  ('ssc.physics.refraction',    'ssc.physics.reflection'),
  ('ssc.physics.magnetism',     'ssc.physics.current')
)
ON CONFLICT (topic_id, prerequisite_topic_id) DO NOTHING;