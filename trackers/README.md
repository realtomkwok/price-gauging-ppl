# Trackers
## WWS Trackers
- `scheduleProductTracker` - Schedule the product tracker to run at a specific time.
- `triggerProductTracker` - Trigger the product tracker to run immediately.

### Start `triggerProductTracker`:
- Start the tracker locally:
```bash
curl -X POST http://127.0.0.1:5001/price-gauging-ppl/australia-southeast1/triggerProductTracker \
  -H "Authorization: Bearer `{$FIREBASE_APP_TOKEN}`" \
  -H "Content-Type: application/json" \
```
- Start the tracker on GCP (after deploying the tracker):
```bash
curl -X https://triggerproducttracker-2jsxpc64kq-ts.a.run.app/triggerProductTracker \
  -H "Authorization: Bearer `{$FIREBASE_APP_TOKEN}`" \
  -H "Content-Type: application/json" \
```
*To track a specific categories, add categories to the body of the request:*
```bash
  -d '{"categories": [{"id": "1_5AF3A0A", "name": "Drinks", "urlFriendlyName": "drinks"}]}'
```
# Known Issues
- Function runs too long (> 15 minutes) and triggers timeout for some categories (e.g. Cleaning)
