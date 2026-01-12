import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { Calendar, MapPin, Clock } from 'lucide-react';

const EventsPage = () => {
    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-12 text-center">Upcoming <span className="text-gradient">Events</span></h1>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            title: "AI in Healthcare Summit 2026",
                            date: "March 15, 2026",
                            location: "San Francisco, CA",
                            desc: "Join us as we unveil the latest version of PneumaScan and discuss the future of AI radiology."
                        },
                        {
                            title: "Medical Imaging Workshop",
                            date: "April 10, 2026",
                            location: "Online Webinar",
                            desc: "A technical deep dive into how CNNs are reshaping pneumonia diagnosis. Open to all Radiologists."
                        },
                        {
                            title: "Global Health Texh Expo",
                            date: "May 22, 2026",
                            location: "London, UK",
                            desc: "Meet our team at booth #405 to get a live demo of our portable diagnostic solutions."
                        }
                    ].map((event, i) => (
                        <Card key={i} className="flex flex-col h-full hover:border-emerald-500/50 transition-colors group">
                            <div className="h-48 bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg mb-6 flex items-center justify-center overflow-hidden relative">
                                <div className="prefix-img absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <Calendar size={48} className="text-gray-600 group-hover:text-emerald-500 transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">{event.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 flex-grow">{event.desc}</p>
                            <div className="space-y-3 text-sm text-gray-400 mb-6">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-emerald-500" />
                                    {event.date}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-emerald-500" />
                                    {event.location}
                                </div>
                            </div>
                            <Button variant="outline" className="w-full">Register Now</Button>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EventsPage;
