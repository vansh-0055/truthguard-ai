import React, { useState } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const Feedback: React.FC = () => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const reviews = [
        { id: 1, user: "Sarah J.", rating: 5, text: "Incredibly accurate! Saved me from sharing a fake article about the election.", date: "2 days ago" },
        { id: 2, user: "Mike T.", rating: 4, text: "Very fast analysis. I wish it had a browser extension.", date: "1 week ago" },
        { id: 3, user: "Elena R.", rating: 5, text: "The best fact-checking tool I've used. Love the detailed reasoning.", date: "2 weeks ago" }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Thank you for your feedback!");
        setComment('');
        setRating(0);
    };

    return (
        <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">User Feedback</h2>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Write Review */}
                <div className="md:col-span-1">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm sticky top-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Share Feedback</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                                <div className="flex space-x-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className={`transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                        >
                                            <Star className="w-6 h-6 fill-current" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Feedback</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full p-3 border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:text-white dark:placeholder-gray-500 outline-none resize-none h-32"
                                    placeholder="Share your experience..."
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                            >
                                <Send className="w-4 h-4 mr-2" /> Submit Feedback
                            </button>
                        </form>
                    </div>
                </div>

                {/* Review List */}
                <div className="md:col-span-2 space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                                        {review.user.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">{review.user}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{review.date}</p>
                                    </div>
                                </div>
                                <div className="flex text-yellow-400">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-current" />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">"{review.text}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Feedback;
