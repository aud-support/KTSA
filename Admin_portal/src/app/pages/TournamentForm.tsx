import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input, Textarea, Select } from '../components/Input';
import { useCMS, Tournament } from '../context/CMSContext';

export const TournamentForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { tournaments, addTournament, updateTournament } = useCMS();

  const isEdit = !!id;
  const existingTournament = isEdit ? tournaments.find((t) => t.id === id) : null;

  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    format: 'Single Elimination',
    status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed',
    venue: '',
    maxParticipants: '16',
    prizePool: '',
    challengeBracketUrl: '',
    description: '',
  });

  useEffect(() => {
    if (existingTournament) {
      setFormData({
        name: existingTournament.name,
        startDate: existingTournament.startDate,
        endDate: existingTournament.endDate,
        format: existingTournament.format,
        status: existingTournament.status,
        venue: existingTournament.venue,
        maxParticipants: existingTournament.maxParticipants.toString(),
        prizePool: existingTournament.prizePool,
        challengeBracketUrl: existingTournament.challengeBracketUrl,
        description: existingTournament.description,
      });
    }
  }, [existingTournament]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tournamentData = {
      ...formData,
      maxParticipants: parseInt(formData.maxParticipants),
    };

    if (isEdit && id) {
      updateTournament(id, tournamentData);
      toast.success('Tournament updated successfully!');
    } else {
      addTournament(tournamentData);
      toast.success('Tournament created successfully!');
    }

    navigate('/tournaments');
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/tournaments')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="mb-2">
          {isEdit ? (
            <>
              Edit Tournament:{' '}
              <span className="bg-gradient-to-r from-ktsa-primary to-ktsa-accent bg-clip-text text-transparent">
                {existingTournament?.name}
              </span>
            </>
          ) : (
            'Create Tournament'
          )}
        </h1>
        <p className="text-muted-foreground">
          {isEdit ? `Modify the details for ${existingTournament?.name}` : 'Add a new tournament entry'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <div className="space-y-6">
            <h3 className="text-sm text-muted-foreground uppercase tracking-wider border-b border-border pb-2 mb-4">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Tournament Name *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Bengaluru Open 2026"
                required
              />
              <Input
                label="Venue"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g. Koramangala Indoor Stadium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date *"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
              <Input
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Format"
                name="format"
                value={formData.format}
                onChange={handleChange}
                options={[
                  { value: 'Single Elimination', label: 'Single Elimination' },
                  { value: 'Round Robin', label: 'Round Robin' },
                  { value: 'League', label: 'League' },
                  { value: 'Swiss System', label: 'Swiss System' },
                ]}
              />
              <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: 'upcoming', label: 'Upcoming' },
                  { value: 'ongoing', label: 'Ongoing' },
                  { value: 'completed', label: 'Completed' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Max Participants"
                name="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={handleChange}
                placeholder="e.g. 16"
              />
              <Input
                label="Prize Pool (₹)"
                name="prizePool"
                value={formData.prizePool}
                onChange={handleChange}
                placeholder="e.g. 50000"
              />
            </div>

            <Input
              label="Challonge Bracket URL"
              name="challengeBracketUrl"
              value={formData.challengeBracketUrl}
              onChange={handleChange}
              placeholder="https://challonge.com/..."
            />

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tournament description, rules, format details..."
              rows={4}
            />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button type="button" variant="ghost" onClick={() => navigate('/tournaments')}>
            Cancel
          </Button>
          <Button type="submit">
            {isEdit ? 'Save Changes' : 'Create Tournament'}
          </Button>
        </div>
      </form>
    </div>
  );
};