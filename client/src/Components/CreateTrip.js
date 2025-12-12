import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateTrip() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [thumbnail, setThumbnail] = useState(''); // keeps existing URL if any
  const [thumbnailFile, setThumbnailFile] = useState(null); // File object when user uploads
  const [thumbnailPreview, setThumbnailPreview] = useState(''); // preview src (object URL or remote)
  const [date, setDate] = useState('');
  const [endDate, setEndDate] = useState(''); // new end date
  const [description, setDescription] = useState('');
  const [tips, setTips] = useState(['']);
  const [budget, setBudget] = useState('');
  const [people, setPeople] = useState('');
  const [itinerary, setItinerary] = useState([
    { date: '', activities: [{ time: '', description: '', location: '' }] },
  ]);
  const [submitting, setSubmitting] = useState(false);

  // track whether the preview url is an object URL we should revoke
  const prevPreviewIsObjectRef = useRef(false);
  const prevPreviewUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      // cleanup object URL on unmount
      if (prevPreviewIsObjectRef.current && prevPreviewUrlRef.current) {
        URL.revokeObjectURL(prevPreviewUrlRef.current);
      }
    };
  }, []);

  // Validation: title, destination, budget, people required.
  // For activities: if activity has time or description, location is required.
  const validate = () => {
    const missing = [];
    if (!title.trim()) missing.push('Title');
    if (!destination.trim()) missing.push('Destination');
    if (!budget.trim()) missing.push('Budget');

    // people must be an integer > 0
    if (!people.toString().trim() || !/^\d+$/.test(people.toString().trim()) || Number(people) <= 0) {
      missing.push('Number of people (positive integer)');
    }

    const missingLocations = [];
    itinerary.forEach((day, dayIndex) => {
      day.activities.forEach((act, actIndex) => {
        const hasContent = (act.description && act.description.trim()) || (act.time && act.time.trim());
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

  // handle file selection and create a preview
  const handleThumbnailFileChange = e => {
    const file = e.target.files && e.target.files[0];
    // revoke previous object URL if any
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

  // helpers to upload file or fallback to data URL
  const fileToDataUrl = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  async function tryUploadFileToServer(file) {
    // attempts to POST a single file to /api/upload and expect JSON { url: "..." }
    // adjust endpoint/key to match your backend.
    const fd = new FormData();
    fd.append('file', file);
    // ADD: include Bearer token
    const token = localStorage.getItem('token');
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: fd,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || 'Upload failed');
    }
    const data = await res.json();
    // common response shapes: { url }, { path }, { filename }
    return data.url || data.path || data.filename || data.fileUrl || null;
  }

  // Itinerary helpers
  const addDay = () =>
    setItinerary(prev => [...prev, { date: '', activities: [{ time: '', description: '', location: '' }] }]);

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

  // Day date updater
  const updateDayDate = (dayIndex, value) =>
    setItinerary(prev =>
      prev.map((day, i) => (i === dayIndex ? { ...day, date: value } : day))
    );

  // Tips helpers
  const updateTip = (index, value) =>
    setTips(prev => prev.map((t, i) => (i === index ? value : t)));

  const addTip = () => setTips(prev => [...prev, '']);
  const removeTip = index => setTips(prev => prev.filter((_, i) => i !== index));

  const onSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      let thumbnailUrl = '/public-imgs/default-trip.png';

      if (thumbnailFile) {
        try {
          const uploaded = await tryUploadFileToServer(thumbnailFile);
          if (uploaded) {
            thumbnailUrl = uploaded;
          } else {
            thumbnailUrl = await fileToDataUrl(thumbnailFile);
          }
        } catch (err) {
          console.warn('Upload failed, falling back to data URL:', err);
          try {
            thumbnailUrl = await fileToDataUrl(thumbnailFile);
          } catch {
            thumbnailUrl = '/public-imgs/default-trip.png';
          }
        }
      } else if (thumbnail) {
        thumbnailUrl = thumbnail;
      }

      // Use Users table id stored in localStorage (from the 'user' JSON)
      const storedUserJson = localStorage.getItem('user');
      const storedUser = storedUserJson ? JSON.parse(storedUserJson) : null;

      const tripPayload = {
        user_id: storedUser?.id, // <-- use user.id from localStorage 'user'
        title: title,
        summary: description,
        start_date: date,
        end_date: endDate || date, // use endDate if set, otherwise fallback to start date
        number_of_people: parseInt(people, 10) || 1, // use new people field
        total_price: Number(budget) || 0,
      };

      // ADD: include Bearer token
      const token = localStorage.getItem('token');
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(tripPayload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Failed to create trip');
      }

      const createdTrip = await res.json();
      const tripId = createdTrip.id ?? createdTrip._id;

      if (tripId) {
        // For each day, create a day first, then post each activity as an event
        for (const day of itinerary) {
          const dayPayload = { date: day.date };
          // ADD: include Bearer token
          const dayRes = await fetch(`/api/trips/${tripId}/days`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(dayPayload),
          });

          if (!dayRes.ok) {
            console.error("Failed to create day:", await dayRes.text());
            continue; // skip to next day
          }

          const createdDay = await dayRes.json();
          const dayId = createdDay.id ?? createdDay._id;

          // POST each activity as an event
          for (const act of day.activities) {
            const eventPayload = {
              title: act.description,
              notes: act.notes || '',
              location: act.location,
              cost: act.cost || '0',
              time: act.time,
              photo_url: act.photo_url || '',
            };

            // ADD: include Bearer token
            const eventRes = await fetch(
              `/api/trips/${tripId}/days/${dayId}/events`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify(eventPayload),
              }
            );

            if (!eventRes.ok) {
              console.error("Failed to add event:", await eventRes.text());
            }
          }
        }

        // navigate(`/itinerary/${tripId}`, { state: { trip: createdTrip } });
        navigate('/Profile');
      } else {
        navigate('/Profile');
      }
    } catch (error) {
      console.error('Create trip error:', error);
      alert('Failed to create trip. See console for details.');
    } finally {
      setSubmitting(false);
    }
  };

  // format yyyy-mm-dd -> user locale short date
  const formatDateDisplay = (isoDate) => {
    if (!isoDate) return '';
    try {
      const d = new Date(isoDate);
      if (Number.isNaN(d.getTime())) return isoDate;
      return d.toLocaleDateString();
    } catch {
      return isoDate;
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
          <p className="create-subtext">Fields marked with * are required. Add days and activities on the right.</p>
        </header>

        <form className="create-trip-form" onSubmit={onSubmit}>
          <div className="create-grid">
            <div className="left-col card">
              <h2 className="card-title">Trip Info</h2>

              <div className="form-row">
                <label htmlFor="trip-title" className="required">Title</label>
                <input id="trip-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Tokyo Adventure" />
              </div>

              <div className="form-row">
                <label htmlFor="trip-destination" className="required">Destination</label>
                <input id="trip-destination" value={destination} onChange={e => setDestination(e.target.value)} placeholder="City, Country" />
              </div>

              <div className="form-row two-up">
                <div>
                  <label htmlFor="trip-date">Start Date</label>
                  <input id="trip-date" type="date" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="trip-end-date">End Date</label>
                  <input id="trip-end-date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
              </div>

              <div className="form-row">
                <label htmlFor="trip-budget" className="required">Budget</label>
                <input id="trip-budget" value={budget} onChange={e => setBudget(e.target.value)} placeholder="Approx. $..." />
              </div>

              <div className="form-row">
                <label htmlFor="trip-people" className="required">How many people?</label>
                <input
                  id="trip-people"
                  type="number"
                  min="1"
                  step="1"
                  value={people}
                  onChange={e => setPeople(e.target.value.replace(/[^\d]/g, ''))}
                  placeholder="e.g. 2"
                />
              </div>

              <div className="form-row">
                <label htmlFor="trip-thumbnail-file">Thumbnail (upload)</label>
                <input
                  id="trip-thumbnail-file"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailFileChange}
                />
                {thumbnailPreview ? (
                  <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <img src={thumbnailPreview} alt="thumbnail preview" style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 8 }} />
                    <button
                      type="button"
                      className="small-btn ghost"
                      onClick={() => {
                        // clear file + preview
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
                ) : null}
              </div>

              <div className="form-row">
                <label htmlFor="trip-description">Description</label>
                <textarea id="trip-description" value={description} onChange={e => setDescription(e.target.value)} rows={5} placeholder="Short summary of the trip" />
              </div>
            </div>

            <div className="right-col">
              <div className="sticky-right">
                <div className="card preview-card">
                  <div className="preview-thumb">
                    <img
                      src={thumbnailPreview || thumbnail || '/public-imgs/default-trip.png'}
                      alt="trip thumbnail preview"
                    />
                  </div>
                  <div className="preview-meta">
                    <h3 className="preview-title">{title || 'Untitled Trip'}</h3>
                    <p className="muted preview-sub">{destination || 'Destination'}</p>
                  </div>
                </div>

                <div className="card itinerary-editor">
                  <h2 className="card-title">Itinerary</h2>

                  {itinerary.map((day, dayIndex) => (
                    <div key={dayIndex} className="day-editor">
                      <div className="day-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                          <strong>Day {dayIndex + 1}</strong>

                          {/* show input only while date not set; once set the input is removed */}
                          {!day.date ? (
                            <input
                              type="date"
                              className="day-date-input"
                              value={day.date || ''}
                              onChange={e => updateDayDate(dayIndex, e.target.value)}
                              aria-label={`Date for Day ${dayIndex + 1}`}
                            />
                          ) : (
                            <span className="day-date-display">{formatDateDisplay(day.date)}</span>
                          )}
                        </div>

                        <div className="day-controls">
                          <button type="button" className="small-btn" onClick={() => addActivity(dayIndex)}>+ Activity</button>
                          {itinerary.length > 1 && (
                            <button
                              type="button"
                              className="small-btn ghost"
                              onClick={() => removeDay(dayIndex)}
                              aria-label={`Remove Day ${dayIndex + 1}`}
                              title="Remove day"
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
                            placeholder="Activity description"
                            value={act.description}
                            onChange={e => updateActivity(dayIndex, actIndex, 'description', e.target.value)}
                          />
                          <input
                            className="act-loc"
                            placeholder="Location*"
                            value={act.location}
                            onChange={e => updateActivity(dayIndex, actIndex, 'location', e.target.value)}
                          />
                          {!(day.activities.length === 1 && itinerary.length === 1) && (
                            <button
                              type="button"
                              className="small-btn ghost icon-btn"
                              onClick={() => removeActivity(dayIndex, actIndex)}
                              aria-label={`Remove activity ${actIndex + 1} (Day ${dayIndex + 1})`}
                              title="Remove activity"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true">
                                <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.89 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z"/>
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}

                  <div className="itinerary-actions">
                    <button type="button" className="btn add-day" onClick={addDay}>+ Add Day</button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={submitting} className="btn primary">
              {submitting ? 'Creating...' : 'Create Trip'}
            </button>
            <button type="button" className="btn secondary" onClick={() => navigate('/Profile')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTrip;