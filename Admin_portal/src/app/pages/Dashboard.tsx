import React from "react";
import { useNavigate } from "react-router";
import {
  Trophy,
  Newspaper,
  FileText,
  Award,
  Plus,
  Pencil,
  Home,
  Award as SponsorIcon,
} from "lucide-react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { useCMS } from "../context/CMSContext";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { tournaments, articles, rules, sponsors } = useCMS();

  const stats = [
    {
      label: "Tournaments",
      value: tournaments.length,
      icon: <Trophy size={24} />,
      gradient: "from-ktsa-primary to-ktsa-accent",
      action: () => navigate("/tournaments"),
    },
    {
      label: "News Articles",
      value: articles.length,
      icon: <Newspaper size={24} />,
      gradient: "from-blue-400 to-cyan-400",
      action: () => navigate("/articles"),
    },
    {
      label: "CMS Sections",
      value: 6,
      icon: <FileText size={24} />,
      gradient: "from-purple-400 to-pink-400",
      action: () => {},
    },
    {
      label: "Sponsors",
      value: sponsors.length,
      icon: <Award size={24} />,
      gradient: "from-orange-400 to-yellow-400",
      action: () => navigate("/sponsors"),
    },
  ];

  const quickActions = [
    {
      label: "Add Tournament",
      description: "Create a new tournament entry",
      icon: <Plus size={20} />,
      action: () => navigate("/tournaments/new"),
    },
    {
      label: "Write Article",
      description: "Publish news or announcements",
      icon: <Pencil size={20} />,
      action: () => navigate("/articles"),
    },
    {
      label: "Edit Homepage",
      description: "Update homepage sections",
      icon: <Home size={20} />,
      action: () => navigate("/homepage"),
    },
    {
      label: "Manage Sponsors",
      description: "Add or update sponsors",
      icon: <SponsorIcon size={20} />,
      action: () => navigate("/sponsors"),
    },
  ];

  const recentTournaments = tournaments.slice(0, 3);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "ongoing":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "completed":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-2 lg:p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">
          Good evening,{" "}
          <span className="bg-gradient-to-r from-ktsa-primary to-ktsa-accent bg-clip-text text-transparent">
            KTSA
          </span>
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with KTSA
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="cursor-pointer hover:border-ktsa-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-ktsa-primary/10 relative overflow-hidden group"
            onClick={stat.action}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
            />
            <div className="flex items-start justify-between relative">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {stat.label}
                </p>
                <p
                  className={`text-3xl font-semibold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                >
                  {stat.value}
                </p>
              </div>
              <div
                className={`p-2 bg-gradient-to-br ${stat.gradient} rounded-lg shadow-lg`}
              >
                <span className="text-black">{stat.icon}</span>
              </div>
            </div>
            <button
              className={`mt-4 text-sm bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent hover:underline font-medium`}
            >
              view →
            </button>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="mb-4 uppercase text-sm text-muted-foreground tracking-wider">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={action.action}
              className="bg-card border border-border rounded-lg p-4 text-left hover:border-ktsa-primary/50 transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-ktsa-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-ktsa-primary/20 transition-colors">
                <span className="text-ktsa-primary">{action.icon}</span>
              </div>
              <p className="font-medium mb-1">{action.label}</p>
              <p className="text-sm text-muted-foreground">
                {action.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Tournaments */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h3 className="uppercase text-sm text-muted-foreground tracking-wider">
            Recent Tournaments
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/tournaments")}
          >
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {recentTournaments.map((tournament) => (
            <Card
              key={tournament.id}
              className="hover:border-ktsa-primary/50 transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-ktsa-primary/10"
              onClick={() => navigate(`/tournaments/${tournament.id}/matches`)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                    <h4 className="font-medium hover:text-ktsa-primary transition-colors">
                      {tournament.name}
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs border ${getStatusColor(
                        tournament.status,
                      )}`}
                    >
                      {tournament.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(tournament.startDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/tournaments/${tournament.id}/matches`);
                    }}
                  >
                    View Matches
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/tournaments/${tournament.id}/edit`);
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <Card className="mt-6 bg-gradient-to-r from-ktsa-secondary/10 to-ktsa-accent/10 border-ktsa-accent/30">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gradient-to-br from-ktsa-primary to-ktsa-accent rounded-lg shadow-lg">
            <FileText size={20} className="text-black" />
          </div>
          <div>
            <p className="text-sm font-medium bg-gradient-to-r from-ktsa-primary to-ktsa-accent bg-clip-text text-transparent">
              Currently running with mock data. Connect the Spring Boot API to
              go live.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
