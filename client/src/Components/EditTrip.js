import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

function EditTrip() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const stateTrip = location.state?.trip;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [date, setDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [tips, setTips] = useState(['']);
  const [budget, setBudget] = useState('');
  const [people, setPeople] = useState('');

  // New: days with events
  const [days, setDays] = useState([]);
  const [daysLoading, setDaysLoading] = useState(true);

  const prevPreviewIsObjectRef = useRef(false);
  const prevPreviewUrlRef = useRef(null);

  // ---------------- FETCH TRIP ----------------
  useEffect(() => {
    const populateTrip = trip => {
      setTitle(trip.title || '');
      setDestination(trip.destination || '');
      setThumbnail(trip.thumbnail || '');
      setThumbnailPreview(trip.thumbnail || '');
      prevPreviewIsObjectRef.current = false;

      const start = trip.start_date || trip.date || '';
      const end = trip.end_date || '';
      setDate(start ? String(start).split('T')[0] : '');
      setEndDate(end ? String(end).split('T')[0] : '');

      setDescription(trip.destination || '');
      setTips(trip.tips?.length ? trip.tips : ['']);
      setBudget(trip.total_price || '');
      setPeople(trip.likes ? String(trip.likes) : '');
    };

    if (stateTrip) {
      populateTrip(stateTrip);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`/api/trips/${id}`);
        if (!res.ok) throw new Error('Failed to fetch trip');
        const trip = await res.json();
        populateTrip(trip);
      } catch (err) {
        console.error('EditTrip fetch error', err);
        navigate(-1);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, stateTrip, navigate]);

  // ---------------- FETCH DAYS & EVENTS ----------------
  useEffect(() => {
    if (!id) return;

    const fetchDaysAndEvents = async () => {
      try {
        const res = await fetch(`/api/trips/${id}/days`);
        if (!res.ok) {
          setDays([]);
          setDaysLoading(false);
          return;
        }
        const dayData = await res.json();

        const updatedDays = await Promise.all(
          dayData.map(async day => {
            try {
              const evRes = await fetch(`/api/trips/${id}/days/${day.id}/events`);
              const events = evRes.ok ? await evRes.json() : [];
              return {
                ...day,
                activities: events.map(ev => ({
                  time: ev.time || '',
                  description: ev.title || ev.description || '',
                  location: ev.location || ''
                }))
              };
            } catch (err) {
              console.error('Error fetching events for day', day.id, err);
              return { ...day, activities: [] };
            }
          })
        );

        // If no days returned, create default
        if (updatedDays.length === 0) {
          setDays([{ id: 'temp-0', activities: [{ time: '', description: '', location: '' }] }]);
        } else {
          setDays(updatedDays);
        }
      } catch (err) {
        console.error('Error fetching days', err);
      } finally {
        setDaysLoading(false);
      }
    };

    fetchDaysAndEvents();
  }, [id]);

  // ---------------- CLEANUP ----------------
  useEffect(() => {
    return () => {
      if (prevPreviewIsObjectRef.current && prevPreviewUrlRef.current) {
        URL.revokeObjectURL(prevPreviewUrlRef.current);
      }
    };
  }, []);

  // ---------------- THUMBNAIL ----------------
  const handleThumbnailFileChange = e => {
    const file = e.target.files && e.target.files[0];
    if (prevPreviewIsObjectRef.current && prevPreviewUrlRef.current) {
      URL.revokeObjectURL(prevPreviewUrlRef.current);
      prevPreviewIsObjectRef.current = false;
      prevPreviewUrlRef.current = null;
    }
    if (!file) {
      setThumbnailFile(null);
      setThumbnailPreview(thumbnail || '');
      return;
    }
    setThumbnailFile(file);
    const objUrl = URL.createObjectURL(file);
    prevPreviewIsObjectRef.current = true;
    prevPreviewUrlRef.current = objUrl;
    setThumbnailPreview(objUrl);
  };

  // ---------------- VALIDATION ----------------
  const validate = () => {
    const missing = [];
    if (!title.trim()) missing.push('Title');
    if (!destination.trim()) missing.push('Destination');
    if (!budget.toString().trim()) missing.push('Budget');
    if (!people.toString().trim() || !/^\d+$/.test(people.toString().trim()) || Number(people) <= 0) {
      missing.push('Number of people (positive integer)');
    }

    const missingLocations = [];
    days.forEach((day, dayIndex) => {
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
      if (missingLocations.length > 0) msg += 'Please add locations for: ' + missingLocations.join(', ') + '.';
      alert(msg);
      return false;
    }
    return true;
  };

  const fileToDataUrl = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  async function tryUploadFileToServer(file) {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: fd,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || 'Upload failed');
    }
    const data = await res.json();
    return data.url || data.path || data.filename || data.fileUrl || null;
  }

  // ---------------- ITINERARY EDITING ----------------
  const addDay = () =>
    setDays(prev => [...prev, { id: `temp-${prev.length}`, activities: [{ time: '', description: '', location: '' }] }]);

  const removeDay = index =>
    setDays(prev => prev.filter((_, i) => i !== index));

  const addActivity = dayIndex =>
    setDays(prev =>
      prev.map((day, i) =>
        i === dayIndex
          ? { ...day, activities: [...day.activities, { time: '', description: '', location: '' }] }
          : day
      )
    );

  const removeActivity = (dayIndex, actIndex) =>
    setDays(prev =>
      prev.map((day, i) =>
        i === dayIndex
          ? { ...day, activities: day.activities.filter((_, j) => j !== actIndex) }
          : day
      )
    );

  const updateActivity = (dayIndex, actIndex, field, value) =>
    setDays(prev =>
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

  // ---------------- TIPS ----------------
  const updateTip = (index, value) => setTips(prev => prev.map((t, i) => (i === index ? value : t)));
  const addTip = () => setTips(prev => [...prev, '']);
  const removeTip = index => setTips(prev => prev.filter((_, i) => i !== index));

  // ---------------- SUBMIT ----------------
  const onSubmit = async e => {
  e.preventDefault();
  if (!validate()) return;

  setSubmitting(true);

  try {
    let thumbnailUrl = '/public-imgs/default-trip.png';

    if (thumbnailFile) {
      try {
        const uploaded = await tryUploadFileToServer(thumbnailFile);
        if (uploaded) thumbnailUrl = uploaded;
        else thumbnailUrl = await fileToDataUrl(thumbnailFile);
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

    // PATCH trip info first
    const patchPayload = {
      title: title.trim(),
      description: description.trim(),
      start_date: date || new Date().toISOString().split('T')[0],
      end_date: endDate || date || new Date().toISOString().split('T')[0],
      total_price: Number(budget) || 0,
      number_of_people: parseInt(people, 10) || 1,
      photo_url: thumbnailUrl,
    };

    const token = localStorage.getItem('token');
    const res = await fetch(`/api/trips/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(patchPayload),
    });

    if (!res.ok) throw new Error(await res.text() || 'Failed to update trip');

    // DELETE all existing days
    for (const day of days) {
      if (!day.id) continue; // skip temp days without ID
      try {
        await fetch(`/api/trips/${id}/days/${day.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
      } catch (err) {
        console.error(`Failed to delete day ${day.id}`, err);
      }
    }

    // CREATE all days and their activities
    for (const day of days) {
      // create day first
      const dayPayload = { date: day.date || null };
      const dayRes = await fetch(`/api/trips/${id}/days`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(dayPayload),
      });

      if (!dayRes.ok) {
        console.error('Failed to create day:', await dayRes.text());
        continue;
      }

      const createdDay = await dayRes.json();
      const dayId = createdDay.id ?? createdDay._id;

      // create activities/events
      for (const act of day.activities) {
        const eventPayload = {
          title: act.description,
          notes: act.notes || '',
          location: act.location,
          cost: act.cost || '0',
          time: act.time,
          photo_url: act.photo_url || '',
        };

        const eventRes = await fetch(`/api/trips/${id}/days/${dayId}/events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(eventPayload),
        });

        if (!eventRes.ok) console.error('Failed to create event:', await eventRes.text());
      }
    }

    navigate('/Profile');
  } catch (error) {
    console.error('Edit trip error:', error);
    alert('Failed to update trip. See console for details.');
  } finally {
    setSubmitting(false);
  }
};


  if (loading || daysLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="create-trip-page trip-page">
      <button className="back-button-clean" onClick={() => navigate(-1)}>← Back</button>

      <div className="create-trip-container">
        <header className="create-header">
          <h1>Edit Trip</h1>
          <p className="create-subtext">Update fields and save. Required: Title, Destination, Budget, Number of people.</p>
        </header>

        <form className="create-trip-form" onSubmit={onSubmit}>
          <div className="create-grid">
            <div className="left-col card">
              <h2 className="card-title">Trip Info</h2>

              <div className="form-row">
                <label htmlFor="trip-title" className="required">Title</label>
                <input id="trip-title" value={title} onChange={e => setTitle(e.target.value)} />
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
                <input id="trip-budget" value={budget} onChange={e => setBudget(e.target.value)} />
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
                />
              </div>

              <div className="form-row">
                <label htmlFor="trip-thumbnail-file">Thumbnail (upload)</label>
                <input id="trip-thumbnail-file" type="file" accept="image/*" onChange={handleThumbnailFileChange} />
                {thumbnailPreview && (
                  <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <img src={thumbnailPreview} alt="thumbnail preview" style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 8 }} />
                    <button type="button" className="small-btn ghost" onClick={() => {
                      setThumbnailFile(null);
                      if (prevPreviewIsObjectRef.current && prevPreviewUrlRef.current) {
                        URL.revokeObjectURL(prevPreviewUrlRef.current);
                        prevPreviewIsObjectRef.current = false;
                        prevPreviewUrlRef.current = null;
                      }
                      setThumbnailPreview(thumbnail || '');
                    }}>
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="form-row">
                <label htmlFor="trip-description">Description</label>
                <textarea id="trip-description" value={description} onChange={e => setDescription(e.target.value)} rows={5} />
              </div>
            </div>

            <div className="right-col">
              <div className="sticky-right">
                <div className="card itinerary-editor">
                  <h2 className="card-title">Itinerary</h2>

                  {days.map((day, dayIndex) => (
                    <div key={day.id} className="day-editor">
                      <div className="day-header">
                        <strong>Day {dayIndex + 1}</strong>
                        <div className="day-controls">
                          <button type="button" className="small-btn" onClick={() => addActivity(dayIndex)}>+ Activity</button>
                          {days.length > 1 && (
                            <button type="button" className="small-btn ghost" onClick={() => removeDay(dayIndex)}>Remove</button>
                          )}
                        </div>
                      </div>

                      {day.activities.map((act, actIndex) => (
                        <div key={actIndex} className="activity-row">
                          <input className="act-time" placeholder="09:00" value={act.time} onChange={e => updateActivity(dayIndex, actIndex, 'time', e.target.value)} />
                          <input className="act-desc" placeholder="Activity description" value={act.description} onChange={e => updateActivity(dayIndex, actIndex, 'description', e.target.value)} />
                          <input className="act-loc" placeholder="Location*" value={act.location} onChange={e => updateActivity(dayIndex, actIndex, 'location', e.target.value)} />
                          {!(day.activities.length === 1 && days.length === 1) && (
                            <button type="button" className="small-btn ghost icon-btn" onClick={() => removeActivity(dayIndex, actIndex)} title="Remove activity">
                              &times;
                            </button>
                          )}
                        </div>
                      ))}

                      <div className="itinerary-actions">
                        <button type="button" className="btn add-day" onClick={addDay}>+ Add Day</button>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={submitting} className="btn primary">{submitting ? 'Saving...' : 'Save Changes'}</button>
            <button type="button" className="btn secondary" onClick={() => navigate(`/itinerary/${id}`)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTrip;
