
-- Potluck claims table: tracks who claimed which item
CREATE TABLE public.potluck_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  claimed_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(event_id, item_name)
);

ALTER TABLE public.potluck_claims ENABLE ROW LEVEL SECURITY;

-- Anyone can view claims for live events
CREATE POLICY "Anyone can view potluck claims for live events"
ON public.potluck_claims FOR SELECT
USING (EXISTS (SELECT 1 FROM events WHERE events.id = potluck_claims.event_id AND events.status = 'live'));

-- Event owners can view claims
CREATE POLICY "Event owners can view potluck claims"
ON public.potluck_claims FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM events WHERE events.id = potluck_claims.event_id AND events.user_id = auth.uid()));

-- Admin can view all claims
CREATE POLICY "Admin can view all potluck claims"
ON public.potluck_claims FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can claim items on live events
CREATE POLICY "Anyone can claim potluck items on live events"
ON public.potluck_claims FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM events WHERE events.id = potluck_claims.event_id AND events.status = 'live'));

-- Quiz responses table
CREATE TABLE public.quiz_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  question_index int NOT NULL,
  selected_option int NOT NULL,
  guest_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event owners can view quiz responses"
ON public.quiz_responses FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM events WHERE events.id = quiz_responses.event_id AND events.user_id = auth.uid()));

CREATE POLICY "Admin can view all quiz responses"
ON public.quiz_responses FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can submit quiz responses to live events"
ON public.quiz_responses FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM events WHERE events.id = quiz_responses.event_id AND events.status = 'live'));

-- Game votes table
CREATE TABLE public.game_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  game_name text NOT NULL,
  guest_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(event_id, guest_name)
);

ALTER TABLE public.game_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view game votes for live events"
ON public.game_votes FOR SELECT
USING (EXISTS (SELECT 1 FROM events WHERE events.id = game_votes.event_id AND events.status = 'live'));

CREATE POLICY "Event owners can view game votes"
ON public.game_votes FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM events WHERE events.id = game_votes.event_id AND events.user_id = auth.uid()));

CREATE POLICY "Admin can view all game votes"
ON public.game_votes FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can vote on games for live events"
ON public.game_votes FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM events WHERE events.id = game_votes.event_id AND events.status = 'live'));
