'use client';

import { useState } from 'react';
import { createSalesPoint, updateSalesPoint } from '@/actions/salesPointActions';

interface Location {
    city: string;
    address: string;
    mapLink: string;
}

interface SalesPointFormProps {
    initialData?: {
        id: string;
        name: string;
        locations: Location[];
    };
}

export default function SalesPointForm({ initialData }: SalesPointFormProps) {
    const [name, setName] = useState(initialData?.name || '');
    const [locations, setLocations] = useState<Location[]>(
        initialData?.locations || [{ city: '', address: '', mapLink: '' }]
    );

    const addLocation = () => {
        setLocations([...locations, { city: '', address: '', mapLink: '' }]);
    };

    const removeLocation = (index: number) => {
        if (locations.length > 1) {
            setLocations(locations.filter((_, i) => i !== index));
        }
    };

    const updateLocation = (index: number, field: keyof Location, value: string) => {
        const updated = [...locations];
        updated[index] = { ...updated[index], [field]: value };
        setLocations(updated);
    };

    const handleSubmit = async (formData: FormData) => {
        formData.set('locations', JSON.stringify(locations));
        if (initialData) {
            await updateSalesPoint(initialData.id, formData);
        } else {
            await createSalesPoint(formData);
        }
    };

    return (
        <form action={handleSubmit} className="admin-form" style={{ maxWidth: '800px' }}>
            <div className="admin-input-group">
                <label className="admin-label">Store Name</label>
                <input
                    name="name"
                    type="text"
                    className="admin-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Gültekin Ataseven Bridal House"
                />
            </div>

            <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <label className="admin-label" style={{ marginBottom: '1rem', display: 'block' }}>
                    Locations ({locations.length})
                </label>

                {locations.map((loc, index) => (
                    <div
                        key={index}
                        style={{
                            background: '#f9f9f9',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            border: '1px solid #eee'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Location {index + 1}</span>
                            {locations.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeLocation(index)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#dc2626',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    Remove
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            <div className="admin-input-group">
                                <label className="admin-label">City</label>
                                <select
                                    className="admin-select"
                                    value={loc.city}
                                    onChange={(e) => updateLocation(index, 'city', e.target.value)}
                                    required
                                >
                                    <option value="">Select a city...</option>
                                    {['Adana', 'Adıyaman', 'Afyon', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul', 'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kilis', 'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Şanlıurfa', 'Siirt', 'Sinop', 'Şırnak', 'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'].map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="admin-input-group">
                                <label className="admin-label">Address</label>
                                <textarea
                                    className="admin-textarea"
                                    value={loc.address}
                                    onChange={(e) => updateLocation(index, 'address', e.target.value)}
                                    required
                                    placeholder="Full street address"
                                    rows={2}
                                />
                            </div>

                            <div className="admin-input-group">
                                <label className="admin-label">Google Maps Link (optional)</label>
                                <input
                                    type="url"
                                    className="admin-input"
                                    value={loc.mapLink}
                                    onChange={(e) => updateLocation(index, 'mapLink', e.target.value)}
                                    placeholder="https://maps.google.com/..."
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addLocation}
                    className="admin-btn admin-btn-secondary"
                    style={{ marginBottom: '1rem' }}
                >
                    + Add Another Location
                </button>
            </div>

            <button type="submit" className="admin-btn admin-btn-primary">
                {initialData ? 'Update Sales Point' : 'Create Sales Point'}
            </button>
        </form>
    );
}
