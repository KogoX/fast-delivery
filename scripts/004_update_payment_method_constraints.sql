-- Update ride payment method constraint to support card/cash/wallet options
ALTER TABLE public.rides
  DROP CONSTRAINT IF EXISTS rides_payment_method_check;

ALTER TABLE public.rides
  ADD CONSTRAINT rides_payment_method_check
  CHECK (payment_method IN ('mpesa', 'card', 'cash', 'wallet'));
