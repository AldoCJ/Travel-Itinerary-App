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
  const [endDate, setEndDate] = useState(''); // new endDate state
  const [description, setDescription] = useState('');
  const [tips, setTips] = useState(['']);
  const [budget, setBudget] = useState('');
  const [people, setPeople] = useState('');
  const [itinerary, setItinerary] = useState([{ activities: [{ time: '', description: '', location: '' }] }]);

  const prevPreviewIsObjectRef = useRef(false);
  const prevPreviewUrlRef = useRef(null);

  useEffect(() => {
    const populate = trip => {
      setTitle(trip.title || '');
      setDestination(trip.destination || '');
      setThumbnail(trip.thumbnail || '');
      setThumbnailPreview(trip.thumbnail || '');
      prevPreviewIsObjectRef.current = false; // remote URL, not object URL
      // use start_date or date if present
      setDate((trip.start_date || trip.date) ? (trip.start_date || trip.date).split('T')[0] : '');
      setEndDate(trip.end_date ? trip.end_date.split('T')[0] : '');
      setDescription(trip.description || '');
      setTips((trip.tips && trip.tips.length) ? trip.tips : ['']);
      setBudget(trip.budget || '');
      setPeople(trip.number_of_people ? String(trip.number_of_people) : '');
      setItinerary((trip.itinerary && trip.itinerary.length) ? trip.itinerary : [{ activities: [{ time: '', description: '', location: '' }] }]);
      setLoading(false);
    };

    if (stateTrip) {
      populate(stateTrip);
      return;
    }

    // fetch trip if not provided via navigation state
    (async () => {
      try {
        const res = await fetch(`/api/trips/${id}`);
        if (!res.ok) throw new Error('Failed to fetch trip');
        const trip = await res.json();
        populate(trip);
      } catch (err) {
        console.error('EditTrip fetch error', err);
        navigate(-1);
      }
    })();
  }, [id, stateTrip, navigate]);

  useEffect(() => {
    return () => {
      // revoke object URL if used
      if (prevPreviewIsObjectRef.current && prevPreviewUrlRef.current) {
        URL.revokeObjectURL(prevPreviewUrlRef.current);
      }
    };
  }, []);

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

  // Validation: title, destination, budget, people required.
  // For activities: if activity has time or description, location is required.
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

  const updateTip = (index, value) =>
    setTips(prev => prev.map((t, i) => (i === index ? value : t)));

  const addTip = () => setTips(prev => [...prev, '']);
  const removeTip = index => setTips(prev => prev.filter((_, i) => i !== index));

const onSubmit = async e => {
  e.preventDefault();
  if (!validate()) return;

  setSubmitting(true);
  try {
    let thumbnailUrl = thumbnail || '/public-imgs/default-trip.png';

    if (thumbnailFile) {
      try {
        const uploaded = await tryUploadFileToServer(thumbnailFile);
        if (uploaded) thumbnailUrl = uploaded;
        else thumbnailUrl = await fileToDataUrl(thumbnailFile);
      } catch (err) {
        console.warn('Upload failed, falling back to data URL:', err);
        try {
          thumbnailUrl = await fileToDataUrl(thumbnailFile);
        } catch (err2) {
          console.warn('data url fallback failed', err2);
          thumbnailUrl = thumbnail || '/public-imgs/default-trip.png';
        }
      }
    }

    const patchPayload = {
      title: title.trim(),
      summary: description.trim(),
      start_date: date || new Date().toISOString().split('T')[0],
      end_date: endDate || date || new Date().toISOString().split('T')[0],
      total_price: budget.trim() || undefined,
      number_of_people: people.toString().trim() ? parseInt(people, 10) : undefined,
      photo_url: thumbnailUrl,
    };

    // Remove empty fields
    Object.keys(patchPayload).forEach(
      key => (patchPayload[key] === '' || patchPayload[key] === undefined) && delete patchPayload[key]
    );

    // Use relative URL to leverage frontend proxy (avoids CORS issues)
    const res = await fetch(`/api/trips/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patchPayload),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Failed to update trip');
    }

    const updated = await res.json();
    navigate(`/itinerary/${id}`, { state: { trip: updated, isOwnProfile: true } });
  } catch (err) {
    console.error('Update trip error', err);
    alert('Failed to update trip. See console for details.');
  } finally {
    setSubmitting(false);
  }
};


  if (loading) return <div className="loading">Loading...</div>;

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

              <div className="form-row">
                <label htmlFor="trip-destination" className="required">Destination</label>
                <input id="trip-destination" value={destination} onChange={e => setDestination(e.target.value)} />
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
                        setThumbnailPreview(thumbnail || '');
                      }}
                    >
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

                  {itinerary.map((day, dayIndex) => (
                    <div key={dayIndex} className="day-editor">
                      <div className="day-header">
                        <strong>Day {dayIndex + 1}</strong>
                        <div className="day-controls">
                          <button type="button" className="small-btn" onClick={() => addActivity(dayIndex)}>+ Activity</button>
                          {itinerary.length > 1 && (
                            <button type="button" className="small-btn ghost" onClick={() => removeDay(dayIndex)}>Remove</button>
                          )}
                        </div>
                      </div>

                      {day.activities.map((act, actIndex) => (
                        <div key={actIndex} className="activity-row">
                          <input className="act-time" placeholder="09:00" value={act.time} onChange={e => updateActivity(dayIndex, actIndex, 'time', e.target.value)} />
                          <input className="act-desc" placeholder="Activity description" value={act.description} onChange={e => updateActivity(dayIndex, actIndex, 'description', e.target.value)} />
                          <input className="act-loc" placeholder="Location*" value={act.location} onChange={e => updateActivity(dayIndex, actIndex, 'location', e.target.value)} />
                          {!(day.activities.length === 1 && itinerary.length === 1) && (
                            <button type="button" className="small-btn ghost icon-btn" onClick={() => removeActivity(dayIndex, actIndex)} title="Remove activity">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true"><path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.89 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z"/></svg>
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

                <div className="card tips-editor">
                  <h2 className="card-title">Travel Tips</h2>
                  {tips.map((t, i) => (
                    <div key={i} className="tip-row">
                      <input value={t} onChange={e => updateTip(i, e.target.value)} />
                      {tips.length > 1 && <button type="button" className="small-btn ghost" onClick={() => removeTip(i)}>Remove</button>}
                    </div>
                  ))}
                  <div className="tips-actions">
                    <button type="button" className="btn" onClick={addTip}>+ Add Tip</button>
                  </div>
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