import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateTrip() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [date, setDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [tips, setTips] = useState(['']);
  const [budget, setBudget] = useState('');
  const [people, setPeople] = useState('');
  const [itinerary, setItinerary] = useState([
    { date: '', activities: [{ time: '', description: '', location: '' }] },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const prevPreviewIsObjectRef = useRef(false);
  const prevPreviewUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (prevPreviewIsObjectRef.current && prevPreviewUrlRef.current) {
        URL.revokeObjectURL(prevPreviewUrlRef.current);
      }
    };
  }, []);

  const validate = () => {
    const missing = [];
    if (!title.trim()) missing.push('Title');
    if (!destination.trim()) missing.push('Destination');
    if (!budget.trim()) missing.push('Budget');

    if (!people.toString().trim() || !/^\d+$/.test(people.toString().trim()) || Number(people) <= 0) {
      missing.push('Number of people (positive integer)');
    }

    const missingLocations = [];
    itinerary.forEach((day, dayIndex) => {
      day.activities.forEach((act, actIndex) => {
        const hasContent =
          (act.description && act.description.trim()) ||
          (act.time && act.time.trim());
        if (hasContent && (!act.location || !act.location.trim())) {
          missingLocations.push(`Day ${dayIndex + 1} — activity ${actIndex + 1}`);
        }
      });
    });

    if (missing.length > 0 || missingLocations.length > 0) {
      let msg = '';
      if (missing.length > 0) msg += 'Please provide: ' + missing.join(', ') + '.\n';
      if (missingLocations.length > 0) {
        msg += 'Please add locations for: ' + missingLocations.join(', ') + '.';
      }
      alert(msg);
      return false;
    }
    return true;
  };

  const handleThumbnailFileChange = e => {
    const file = e.target.files && e.target.files[0];
    if (prevPreviewIsObjectRef.current && prevPreviewUrlRef.current) {
      URL.revokeObjectURL(prevPreviewUrlRef.current);
      prevPreviewIsObjectRef.current = false;
      prevPreviewUrlRef.current = null;
    }

    if (!file) {
      setThumbnailFile(null);
      setThumbnailPreview('');
      return;
    }

    setThumbnailFile(file);
    const objUrl = URL.createObjectURL(file);
    prevPreviewIsObjectRef.current = true;
    prevPreviewUrlRef.current = objUrl;
    setThumbnailPreview(objUrl);
  };

  const addDay = () =>
    setItinerary(prev => [
      ...prev,
      { date: '', activities: [{ time: '', description: '', location: '' }] },
    ]);

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

  const updateDayDate = (dayIndex, value) =>
    setItinerary(prev =>
      prev.map((day, i) => (i === dayIndex ? { ...day, date: value } : day))
    );

  const updateTip = (index, value) =>
    setTips(prev => prev.map((t, i) => (i === index ? value : t)));

  const addTip = () => setTips(prev => [...prev, '']);
  const removeTip = index => setTips(prev => prev.filter((_, i) => i !== index));

  const formatDateDisplay = isoDate => {
    if (!isoDate) return '';
    try {
      const d = new Date(isoDate);
      if (Number.isNaN(d.getTime())) return isoDate;
      return d.toLocaleDateString();
    } catch {
      return isoDate;
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const storedUserJson = localStorage.getItem('user');
      const storedUser = storedUserJson ? JSON.parse(storedUserJson) : null;

      const tripPayload = {
        user_id: storedUser?.id,
        title: title,
        summary: description,
        start_date: date,
        end_date: endDate || date,
        number_of_people: parseInt(people, 10) || 1,
        total_price: Number(budget) || 0,
      };

      const token = localStorage.getItem('token');
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(tripPayload),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const createdTrip = await res.json();
      const tripId = createdTrip.id ?? createdTrip._id;

      /** ───────────────────────────────────────────
       *   NEW: Upload picture AFTER creating trip
       *  ─────────────────────────────────────────── */
      if (tripId && thumbnailFile) {
        try {
          const fd = new FormData();
          fd.append('picture', thumbnailFile);

          const uploadRes = await fetch(`/api/trips/${tripId}/picture`, {
            method: 'PATCH',
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: fd,
          });

          if (!uploadRes.ok) {
            console.error("Failed to upload trip picture:", await uploadRes.text());
          }
        } catch (err) {
          console.error("Error uploading trip picture:", err);
        }
      }

      /** Create days + events */
      if (tripId) {
        for (const day of itinerary) {
          const dayPayload = { date: day.date };

          const dayRes = await fetch(`/api/trips/${tripId}/days`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(dayPayload),
          });

          if (!dayRes.ok) continue;

          const createdDay = await dayRes.json();
          const dayId = createdDay.id ?? createdDay._id;

          for (const act of day.activities) {
            const eventPayload = {
              title: act.description,
              notes: act.notes || '',
              location: act.location,
              cost: act.cost || '0',
              time: act.time,
              photo_url: act.photo_url || '',
            };

            await fetch(`/api/trips/${tripId}/days/${dayId}/events`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify(eventPayload),
            });
          }
        }

        navigate('/Profile');
      } else {
        navigate('/Profile');
      }
    } catch (err) {
      alert('Failed to create trip.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-trip-page trip-page">
      <button className="back-button-clean" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="create-trip-container">
        <header className="create-header">
          <h1>Create New Trip</h1>
          <p className="create-subtext">Fields marked with * are required.</p>
        </header>

        <form className="create-trip-form" onSubmit={onSubmit}>
          <div className="create-grid">
            <div className="left-col card">
              <h2 className="card-title">Trip Info</h2>

              <div className="form-row">
                <label className="required">Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} />
              </div>

              <div className="form-row">
                <label className="required">Destination</label>
                <input value={destination} onChange={e => setDestination(e.target.value)} />
              </div>

              <div className="form-row two-up">
                <div>
                  <label>Start Date</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div>
                  <label>End Date</label>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
              </div>

              <div className="form-row">
                <label className="required">Budget</label>
                <input value={budget} onChange={e => setBudget(e.target.value)} />
              </div>

              <div className="form-row">
                <label className="required">How many people?</label>
                <input
                  type="number"
                  min="1"
                  value={people}
                  onChange={e => setPeople(e.target.value.replace(/[^\d]/g, ''))}
                />
              </div>

              <div className="form-row">
                <label>Thumbnail (upload)</label>
                <input type="file" accept="image/*" onChange={handleThumbnailFileChange} />
                {thumbnailPreview && (
                  <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    <img
                      src={thumbnailPreview}
                      alt="preview"
                      style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 8 }}
                    />
                    <button
                      type="button"
                      className="small-btn ghost"
                      onClick={() => {
                        setThumbnailFile(null);
                        if (prevPreviewIsObjectRef.current && prevPreviewUrlRef.current) {
                          URL.revokeObjectURL(prevPreviewUrlRef.current);
                          prevPreviewIsObjectRef.current = false;
                          prevPreviewUrlRef.current = null;
                        }
                        setThumbnailPreview('');
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="form-row">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={5}
                />
              </div>
            </div>

            <div className="right-col">
              <div className="sticky-right">
                <div className="card preview-card">
                  <div className="preview-thumb">
                    <img
                      src={thumbnailPreview || '/public-imgs/default-trip.png'}
                      alt="thumbnail"
                    />
                  </div>
                  <div className="preview-meta">
                    <h3>{title || 'Untitled Trip'}</h3>
                    <p className="muted">{destination || 'Destination'}</p>
                  </div>
                </div>

                <div className="card itinerary-editor">
                  <h2>Itinerary</h2>

                  {itinerary.map((day, dayIndex) => (
                    <div key={dayIndex} className="day-editor">
                      <div className="day-header">
                        <strong>Day {dayIndex + 1}</strong>
                        {!day.date ? (
                          <input
                            type="date"
                            value={day.date}
                            onChange={e => updateDayDate(dayIndex, e.target.value)}
                          />
                        ) : (
                          <span>{formatDateDisplay(day.date)}</span>
                        )}

                        <div className="day-controls">
                          <button type="button" onClick={() => addActivity(dayIndex)}>
                            + Activity
                          </button>
                          {itinerary.length > 1 && (
                            <button
                              type="button"
                              className="ghost"
                              onClick={() => removeDay(dayIndex)}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>

                      {day.activities.map((act, actIndex) => (
                        <div key={actIndex} className="activity-row">
                          <input
                            className="act-time"
                            placeholder="09:00"
                            value={act.time}
                            onChange={e => updateActivity(dayIndex, actIndex, 'time', e.target.value)}
                          />
                          <input
                            className="act-desc"
                            placeholder="Activity"
                            value={act.description}
                            onChange={e =>
                              updateActivity(dayIndex, actIndex, 'description', e.target.value)
                            }
                          />
                          <input
                            className="act-loc"
                            placeholder="Location*"
                            value={act.location}
                            onChange={e =>
                              updateActivity(dayIndex, actIndex, 'location', e.target.value)
                            }
                          />
                          <button
                            type="button"
                            className="ghost icon-btn"
                            onClick={() => removeActivity(dayIndex, actIndex)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}

                  <button type="button" onClick={addDay} className="btn add-day">
                    + Add Day
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={submitting} className="btn primary">
              {submitting ? 'Creating...' : 'Create Trip'}
            </button>
            <button type="button" className="btn secondary" onClick={() => navigate('/Profile')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTrip;
