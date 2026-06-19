import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaPlayCircle } from 'react-icons/fa'
import { motion } from 'framer-motion'

const HeroSection = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

            <div className="container-custom relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-primary-300 text-sm font-medium mb-6">
                            <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                            Empowering Futures Since 2010
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                            Your Journey to
                            <span className="block gradient-text">World-Class Education</span>
                            <span className="text-white/60 text-2xl sm:text-3xl font-normal mt-2 block">
                                Starts with Mari Educational Trust
                            </span>
                        </h1>

                        <p className="text-white/50 text-lg max-w-lg mt-6 leading-relaxed">
                            Connect with top partner colleges, explore courses, and build your future
                            with guidance from trusted education advisors.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 mt-8">
                            <Link
                                to="/colleges"
                                className="group glass-button bg-primary-500/20 border-primary-500/30 text-white hover:bg-primary-500/30 px-8 py-3.5 flex items-center gap-2"
                            >
                                Explore Colleges
                                <FaArrowRight className="group-hover:translate-x-1 transition" />
                            </Link>
                            <Link
                                to="/about"
                                className="glass-button bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10 px-8 py-3.5 flex items-center gap-2"
                            >
                                <FaPlayCircle />
                                Learn More
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-8 mt-10 pt-8 border-t border-white/5">
                            {[
                                { value: '50+', label: 'Partner Colleges' },
                                { value: '10K+', label: 'Students Placed' },
                                { value: '95%', label: 'Success Rate' },
                            ].map((stat, i) => (
                                <div key={i}>
                                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                                    <div className="text-white/40 text-sm">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right - Glass Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="glass-card p-0 overflow-hidden"
                    >
                        <div className="relative h-64 sm:h-72 overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=800&h=500&fit=crop"
                                alt="Campus"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark-400/80 to-transparent" />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-white">Featured Partner</h3>
                            <p className="text-white/60 text-sm mt-1">Stanford University · California</p>
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-primary-400 text-sm font-medium">#1 Ranking</span>
                                <Link
                                    to="/colleges/stanford-university"
                                    className="text-white/40 hover:text-white text-sm transition"
                                >
                                    View Details →
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection