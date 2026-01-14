'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@/components/form/TextField';
import TextArea from '@/components/form/TextArea';
import Button from '@/components/ui/Button';
import Alert from '@/components/feedback/Alert';
import { useState } from 'react';

const ContactSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

type ContactValues = z.infer<typeof ContactSchema>;

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<ContactValues>({
    resolver: zodResolver(ContactSchema),
    defaultValues: { name: '', email: '', message: '' }
  });

  async function onSubmit(values: ContactValues) {
    setStatus('idle');
    setErrorMessage(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus('error');
        setErrorMessage(data.error || 'Unexpected error');
        return;
      }
      setStatus('success');
      form.reset();
    } catch (e: unknown) {
      setStatus('error');
      const message = e instanceof Error ? e.message : 'Network error';
      setErrorMessage(message);
    }
  }

  return (
    <div className="bg-[#0b061a] text-white min-h-screen">

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0b3d] via-[#2b0f66] to-[#120826] animate-fade-in" />

        <div className="relative px-6 py-28 text-center">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm backdrop-blur animate-float mx-auto">
            <span className="bg-purple-600 text-xs px-2 py-1 rounded-full animate-pulse-glow">Contact</span>
            Get in Touch
          </span>

          <h1 className="mt-8 text-5xl lg:text-6xl font-bold leading-tight animate-slide-up animate-stagger-1">
            Contact Our <span className="text-purple-400">Team</span>
          </h1>

          <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto animate-slide-up animate-stagger-2">
            Have questions about Raihsuite ERP? We're here to help you streamline your business operations.
          </p>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-24 animate-fade-in">
        <div className="px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-7xl mx-auto">

            {/* Contact Information */}
            <div className="space-y-8 animate-slide-in-left">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">Get in Touch</h2>
                <p className="text-white/70 mb-8 text-lg">
                  Ready to transform your business with Raihsuite ERP? Our team is ready to answer your questions
                  and help you get started.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start space-x-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center flex-shrink-0 animate-float">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-1">Email</h3>
                    <p className="text-white/80">support@raihsuite.com</p>
                    <p className="text-sm text-white/60">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center flex-shrink-0 animate-float" style={{animationDelay: '1s'}}>
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-1">Phone</h3>
                    <p className="text-white/80">+1 (555) 123-4567</p>
                    <p className="text-sm text-white/60">Mon-Fri 9AM-6PM EST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center flex-shrink-0 animate-float" style={{animationDelay: '2s'}}>
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-1">Office</h3>
                    <p className="text-white/80">123 Business Ave<br />Suite 100<br />New York, NY 10001</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-8 rounded-2xl border border-purple-500/20 backdrop-blur-sm">
                <h3 className="font-semibold text-purple-300 mb-4 text-xl">Why Choose Raihsuite?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-purple-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white/80">24/7 customer support</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-purple-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white/80">Free implementation consultation</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-purple-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white/80">30-day free trial</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-slide-in-right">
              <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 lg:p-10">
                <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>

                {status === 'success' && (
                  <Alert type="success" message="Thank you! Your message has been sent successfully. We'll get back to you soon." />
                )}
                {status === 'error' && (
                  <Alert type="error" message={errorMessage || 'Failed to send message. Please try again.'} />
                )}

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
                  <TextField
                    label="Full Name"
                    placeholder="Enter your full name"
                    {...form.register('name')}
                    error={form.formState.errors.name?.message}
                  />

                  <TextField
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email address"
                    {...form.register('email')}
                    error={form.formState.errors.email?.message}
                  />

                  <TextArea
                    label="Message"
                    rows={6}
                    placeholder="Tell us about your business needs and how we can help..."
                    {...form.register('message')}
                    error={form.formState.errors.message?.message}
                  />

                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {form.formState.isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </div>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </form>

                <p className="text-xs text-white/60 mt-6 text-center">
                  We respect your privacy and will never share your information.
                  Response time is typically within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}