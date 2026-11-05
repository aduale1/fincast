# Interview preparation log

For each significant decision: the problem, what we did, why, alternatives, trade-offs, how it was tested, and
questions an interviewer might ask. Answers should be practised in your own words, not memorised from here.

## Money as integer cents

- **Problem:** floating-point numbers can't represent most decimals exactly, so sums drift by fractions of a cent.
- **Solution:** store and calculate in integer cents; convert only for input and display.
- **Tested by:** unit tests in `packages/shared/src/money.test.ts`, including `"12.30"` → `1230` and invalid
  input such as `"12.345"`.
- **Likely questions:**
  - Why not just use JavaScript numbers with two decimal places?
  - How would you split $100 into three equal monthly payments?

## Balance check-ins instead of transaction imports

- **Problem:** a forecast based only on the user's plan drifts from reality; logging every transaction is tedious.
- **Solution:** weekly balance check-ins, with drift measured against the prediction. See ADR 0003.
- **Likely questions:**
  - What did you give up by not tracking transactions?
  - How do you know the forecast is accurate?

## Database constraints as defence in depth

- **Problem:** a bug in the API could write invalid data (a negative bill, a confidence of 150%).
- **Solution:** CHECK constraints and foreign keys in Postgres reject invalid rows even if validation is bypassed.
- **Likely questions:**
  - If you validate in the API already, why validate in the database too?
  - What does `ON DELETE CASCADE` do, and when would it be dangerous?
