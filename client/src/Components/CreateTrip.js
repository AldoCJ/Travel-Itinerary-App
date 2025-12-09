import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateTrip() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [tips, setTips] = useState(['']);
  const [budget, setBudget] = useState('');
  const [itinerary, setItinerary] = useState([
    { activities: [{ time: '', description: '', location: '' }] },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    if (!title.trim() || !destination.trim() || !duration.trim()) {
      alert('Please provide Title, Destination and Duration.');
      return false;
    }
    return true;
  };

  // Itinerary helpers
  const addDay = () =>
    setItinerary(prev => [...prev, { activities: [{ time: '', description: '', location: '' }] }]);

  const removeDay = index =>
    setItinerary(prev => prev.filter((_, i) => i !== index));

  const addActivity = dayIndex =>
    setItinerary(prev =>
      prev.map((day, i) =>
        i === dayIndex
          ? { ...day, activities: [...day.activities, { time: '', description: '', location: '' }] }
          : day
      )
    );

  const removeActivity = (dayIndex, actIndex) =>
    setItinerary(prev =>
      prev.map((day, i) =>
        i === dayIndex
          ? { ...day, activities: day.activities.filter((_, j) => j !== actIndex) }
          : day
      )
    );

  const updateActivity = (dayIndex, actIndex, field, value) =>
    setItinerary(prev =>
      prev.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              activities: day.activities.map((act, j) =>
                j === actIndex ? { ...act, [field]: value } : act
              ),
            }
          : day
      )
    );

  // Tips helpers
  const updateTip = (index, value) =>
    setTips(prev => prev.map((t, i) => (i === index ? value : t)));

  const addTip = () => setTips(prev => [...prev, '']);
  const removeTip = index => setTips(prev => prev.filter((_, i) => i !== index));

  const onSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;

    const tripPayload = {
      title: title.trim(),
      destination: destination.trim(),
      duration: duration.trim(),
      thumbnail: thumbnail.trim() || '/public-imgs/default-trip.png',
      date: date || new Date().toISOString().split('T')[0],
      description: description.trim(),
      itinerary: itinerary.map(day => ({
        activities: day.activities
          .map(a => ({
            time: a.time.trim(),
            description: a.description.trim(),
            location: a.location.trim() || undefined,
          }))
          .filter(a => a.description || a.time), // drop empty activities
      })),
      tips: tips.map(t => t.trim()).filter(Boolean),
      budget: budget.trim(),
    };

    try {
      setSubmitting(true);
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripPayload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Failed to create trip');
      }

      const created = await res.json();
      // If backend returns created trip with id, navigate to its page
      if (created && (created.id || created._id)) {
        const id = created.id ?? created._id;
        navigate(`/itinerary/${id}`, { state: { trip: created } });
      } else {
        // fallback to profile if id not returned
        navigate('/Profile');
      }
    } catch (error) {
      console.error('Create trip error:', error);
      alert('Failed to create trip. See console for details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // added `trip-page` so the existing `.trip-page` CSS will provide a solid page background
    <div className="create-trip-page trip-page">
      <button className="back-button-clean" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1>Create New Trip</h1>

      <form className="create-trip-form" onSubmit={onSubmit}>
        <div className="form-row">
          <label>Title*</label>
          <input value={title} onChange={e => setTitle(e.target.value)} />
        </div>

        <div className="form-row">
          <label>Destination*</label>
          <input value={destination} onChange={e => setDestination(e.target.value)} />
        </div>

        <div className="form-row">
          <label>Duration*</label>
          <input value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 7 days" />
        </div>

        <div className="form-row">
          <label>Thumbnail URL</label>
          <input value={thumbnail} onChange={e => setThumbnail(e.target.value)} placeholder="/public-imgs/..." />
        </div>

        <div className="form-row">
          <label>Start Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>

        <div className="form-row">
          <label>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} />
        </div>

        <div className="itinerary-editor">
          <h3>Itinerary</h3>
          {itinerary.map((day, dayIndex) => (
            <div key={dayIndex} className="day-editor">
              <div className="day-header">
                <strong>Day {dayIndex + 1}</strong>
                <div>
                  <button type="button" onClick={() => addActivity(dayIndex)}>+ Activity</button>
                  {itinerary.length > 1 && (
                    <button type="button" onClick={() => removeDay(dayIndex)}>Remove Day</button>
                  )}
                </div>
              </div>

              {day.activities.map((act, actIndex) => (
                <div key={actIndex} className="activity-row">
                  <input
                    className="act-time"
                    placeholder="Time (09:00)"
                    value={act.time}
                    onChange={e => updateActivity(dayIndex, actIndex, 'time', e.target.value)}
                  />
                  <input
                    className="act-desc"
                    placeholder="Activity description"
                    value={act.description}
                    onChange={e => updateActivity(dayIndex, actIndex, 'description', e.target.value)}
                  />
                  <input
                    className="act-loc"
                    placeholder="Location (optional)"
                    value={act.location}
                    onChange={e => updateActivity(dayIndex, actIndex, 'location', e.target.value)}
                  />
                  {!(day.activities.length === 1 && itinerary.length === 1) && (
                    <button type="button" onClick={() => removeActivity(dayIndex, actIndex)}>Remove</button>
                  )}
                </div>
              ))}
            </div>
          ))}

          <div className="itinerary-actions">
            <button type="button" onClick={addDay}>+ Add Day</button>
          </div>
        </div>

        <div className="tips-editor">
          <h3>Travel Tips</h3>
          {tips.map((t, i) => (
            <div key={i} className="tip-row">
              <input value={t} onChange={e => updateTip(i, e.target.value)} placeholder="Tip" />
              {tips.length > 1 && <button type="button" onClick={() => removeTip(i)}>Remove</button>}
            </div>
          ))}
          <button type="button" onClick={addTip}>+ Add Tip</button>
        </div>

        <div className="form-row">
          <label>Budget (optional)</label>
          <input value={budget} onChange={e => setBudget(e.target.value)} placeholder="Approx. $..." />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create Trip'}</button>
          <button type="button" onClick={() => navigate('/Profile')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default CreateTrip;