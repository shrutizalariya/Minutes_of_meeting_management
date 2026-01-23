
"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Users, FileText, Clock, Plus, Search, Bell, ChevronDown, TrendingUp, Video, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

export default function MeetingDashboard() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const meetingTypes = [
    { name: 'Board Meeting', count: 12, color: 'bg-violet-500', icon: '👔' },
    { name: 'Team Sync', count: 45, color: 'bg-cyan-500', icon: '🤝' },
    { name: 'Client Call', count: 28, color: 'bg-rose-500', icon: '📞' },
    { name: 'Planning', count: 18, color: 'bg-amber-500', icon: '📋' },
  ];

  const meetings = [
    { 
      id: 1, 
      title: 'Q1 Performance Review', 
      type: 'Board Meeting',
      typeColor: 'violet',
      date: 'Jan 12, 2026',
      time: '09:00 - 11:00 AM',
      location: 'Conference Room A',
      attendees: ['Sarah Chen', 'Mike Ross', 'Alex Kumar', '+9 more'],
      status: 'upcoming',
      priority: 'high'
    },
    { 
      id: 2, 
      title: 'Sprint Retrospective', 
      type: 'Team Sync',
      typeColor: 'cyan',
      date: 'Jan 11, 2026',
      time: '02:00 - 03:30 PM',
      location: 'Virtual - Zoom',
      attendees: ['Emma Wilson', 'John Doe', 'Lisa Park', '+5 more'],
      status: 'completed',
      priority: 'medium'
    },
    { 
      id: 3, 
      title: 'Project Kickoff - Phoenix', 
      type: 'Client Call',
      typeColor: 'rose',
      date: 'Jan 13, 2026',
      time: '10:00 - 11:30 AM',
      location: 'Virtual - Teams',
      attendees: ['David Kim', 'Rachel Green', '+3 more'],
      status: 'upcoming',
      priority: 'high'
    },
    { 
      id: 4, 
      title: 'Weekly Team Standup', 
      type: 'Team Sync',
      typeColor: 'cyan',
      date: 'Jan 10, 2026',
      time: '09:30 - 10:00 AM',
      location: 'Conference Room B',
      attendees: ['Team Alpha', '12 members'],
      status: 'completed',
      priority: 'low'
    },
  ];

  const recentActivity = [
    { action: 'Minutes published', meeting: 'Product Strategy Meeting', time: '2 hours ago', user: 'Sarah Chen' },
    { action: 'Meeting scheduled', meeting: 'Q1 Performance Review', time: '5 hours ago', user: 'Mike Ross' },
    { action: 'Action items updated', meeting: 'Sprint Retrospective', time: '1 day ago', user: 'Emma Wilson' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  MinutesFlow
                </span>
              </div>
              
              <div className="flex items-center gap-6 ml-8">
                <a href="#" className="text-sm font-semibold text-violet-600 border-b-2 border-violet-600 pb-1">Dashboard</a>
                <Link href="/meetings" className="text-sm font-medium text-slate-600 hover:text-slate-900">Meetings</Link>
                <Link href="/meetingtype" className="text-sm font-medium text-slate-600 hover:text-slate-900">Meetingtype</Link>
                <Link href="/staff" className="text-sm font-medium text-slate-600 hover:text-slate-900">staff</Link>
                <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900">Calendar</a>
                <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900">Reports</a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search meetings, minutes, members..."
                  className="pl-10 pr-4 py-2 w-80 bg-slate-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <button className="relative p-2 hover:bg-slate-100 rounded-lg">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  JD
                </div>
                <ChevronDown className="w-4 h-4 text-slate-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Good morning, John 👋</h1>
          <p className="text-slate-600">You have 3 meetings scheduled for today</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">127</div>
            <div className="text-sm opacity-90">Total Meetings</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-cyan-600" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">+12%</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">248</div>
            <div className="text-sm text-slate-600">Active Members</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">+8%</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">36</div>
            <div className="text-sm text-slate-600">This Month</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-rose-600" />
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">8 types</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">523</div>
            <div className="text-sm text-slate-600">Minutes Recorded</div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Meetings List */}
          <div className="col-span-8">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Meetings Overview</h2>
                  <div className="flex items-center gap-2">
                    {['all', 'upcoming', 'completed'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedFilter === filter
                            ? 'bg-violet-100 text-violet-700'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {meetings.map((meeting) => (
                  <div key={meeting.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900">{meeting.title}</h3>
                          {meeting.priority === 'high' && (
                            <span className="px-2 py-1 bg-rose-100 text-rose-700 text-xs font-semibold rounded-full">
                              High Priority
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                          <span className={`px-3 py-1 bg-${meeting.typeColor}-100 text-${meeting.typeColor}-700 rounded-full font-medium`}>
                            {meeting.type}
                          </span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{meeting.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{meeting.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{meeting.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {meeting.attendees.slice(0, 3).map((attendee, i) => (
                              <div key={i} className="w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold">
                                {attendee.charAt(0)}
                              </div>
                            ))}
                          </div>
                          <span className="text-sm text-slate-600">
                            {meeting.attendees[meeting.attendees.length - 1]}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {meeting.status === 'upcoming' ? (
                          <span className="flex items-center gap-1 text-sm font-medium text-amber-600">
                            <AlertCircle className="w-4 h-4" />
                            Upcoming
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            Completed
                          </span>
                        )}
                        <button className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full mt-4 py-4 bg-white border-2 border-dashed border-slate-300 rounded-2xl text-slate-600 font-medium hover:border-violet-400 hover:text-violet-600 transition-all flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              <Link href="/meetings/add">Schedule New Meeting</Link>
            </button>
          </div>

          {/* Right Column - Sidebar */}
          <div className="col-span-4 space-y-6">
            {/* Meeting Types */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Meeting Types</h3>
              <div className="space-y-3">
                {meetingTypes.map((type, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${type.color} rounded-lg flex items-center justify-center text-lg`}>
                        {type.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{type.name}</div>
                        <div className="text-xs text-slate-600">{type.count} meetings</div>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 -rotate-90" />
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 text-sm">{activity.action}</div>
                      <div className="text-sm text-slate-600">{activity.meeting}</div>
                      <div className="text-xs text-slate-500 mt-1">{activity.time} • {activity.user}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}