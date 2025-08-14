-- Pre-populate the ring bell gallery with content
INSERT INTO ring_bell_gallery_items (order_position, initial_state, front_image_url, front_text, back_image_url, back_text, is_active) VALUES
(1, 'image', '/lovable-uploads/9fe0f065-3ab9-4c72-9162-5e84ecd29940.png', null, null, 'Fit comfortably into an airplane seat without a second thought.', true),
(2, 'image', '/lovable-uploads/770570cf-21c8-41b5-9fd0-ccefb220b9c0.png', null, null, 'Walk into the pool without feeling the need to cover up.', true),
(3, 'image', '/lovable-uploads/bce2f2c2-1b1b-4b69-b3f3-20e8715f94d2.png', null, null, 'Order clothes online without sending everything back.', true),
(4, 'image', '/lovable-uploads/f984a3bc-024b-4ea3-ba1b-1264a8c298d3.png', null, null, 'Wear that premium suit and actually look like it was made for you.', true),
(5, 'image', '/lovable-uploads/d8b92a30-a0a2-4acd-8f8d-1208eddab2e6.png', null, null, 'Train at the gym without feeling like the odd one out.', true),
(6, 'image', '/lovable-uploads/790fae5b-122d-4e10-b65f-996b6abc5667.png', null, null, 'Run across the street without worrying if you still can.', true),
(7, 'text', null, 'Slip into your favorite clothes from years ago—and feel incredible in them.', null, 'Remember that feeling when everything just fit perfectly and you felt unstoppable?', true),
(8, 'text', null, 'Look in the mirror and smile at what you see looking back.', null, 'That confident, genuine smile that comes from feeling truly comfortable in your own skin.', true),
(9, 'text', null, 'Wake up feeling energized and ready to conquer the day.', null, 'No more dragging yourself out of bed - just pure energy and motivation from the moment you wake up.', true)
ON CONFLICT (order_position) DO NOTHING;