'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/ui/Button';
import Alert from '@/components/feedback/Alert';
import TextField from '@/components/form/TextField';
import TextArea from '@/components/form/TextArea';
import { useState } from 'react';

const ContactSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email'),
  mobile: z.string().min(10, 'Mobile must be at least 10 digits'),
  message: z.string().min(1, 'Message is required'),
});

type ContactValues = z.infer<typeof ContactSchema>;

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<ContactValues>({
    resolver: zodResolver(ContactSchema),
    defaultValues: { name: '', email: '', mobile: '', message: '' }
  });

  async function onSubmit(values: ContactValues) {
    setStatus('idle');
    setErrorMessage(null);
    try {
      const res = await fetch('https://staging-api.raihsuite.com/v1/crm/enquiries/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, phone: values.mobile, tenant: 3 })
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
    <main className="bg-[#0b061a] min-h-screen text-white">

      {/* 
        HERO SECTION 
      */}
      <section className="relative overflow-hidden pt-24 sm:pt-32 lg:py-40">
        {/* Background glow effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0b3d] to-[#0b061a]" />
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 sm:w-96 h-64 sm:h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-56 sm:w-80 h-56 sm:h-80 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

        <div className="relative container-base px-6 text-center z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-light text-sm font-medium border border-white/10 backdrop-blur mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            We're assisting you
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-8 animate-slide-up bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-purple-200">
            Get in <span className="text-brand-light">Touch</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-slide-up animate-stagger-1">
            Have questions about our pricing, features, or need a custom solution?
            Our team is ready to help you streamline your operations.
          </p>
        </div>
      </section>

      {/* 
        CONTENT SECTION
      */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16">

            {/* 
                  LEFT COLUMN: Contact Info
                */}
            <div className="lg:col-span-5 space-y-12 animate-slide-in-left">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Let's start the conversation</h2>
                <p className="text-lg text-gray-400 leading-relaxed">
                  Whether you need a demo, support, or just want to say hello, we're here.
                  Fill out the form and we'll be in touch as soon as possible.
                </p>
              </div>

              <div className="space-y-8">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-brand-light flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Email Us</h3>
                    {/* <p className="text-gray-400 mb-1">We usually reply within 24 hours.</p> */}
                    <a href="mailto:contact@raihsoft.com" className="text-brand-light font-medium hover:text-white transition-colors text-lg">contact@raihsoft.com</a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-brand-light flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Phone</h3>
                    {/* <p className="text-gray-400 mb-1">Mon-Fri from 8am to 5pm.</p> */}
                    <a href="tel:+91 9847 991 099" className="text-brand-light font-medium hover:text-white transition-colors text-lg">+91 9847 991 099</a>
                  </div>
                </div>

                {/* Office */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-brand-light flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Office</h3>
                    {/* <p className="text-gray-400 mb-1">Come say hello at our HQ.</p> */}
                    <p className="text-white font-medium">1st Floor, Al Irshad Plaza, <br />Karaya, Pandikkad, Kerala, 676521</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 
                  RIGHT COLUMN: Form
                */}
            <div className="lg:col-span-7 lg:col-start-6 animate-slide-in-right mt-12 lg:mt-0">
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 lg:p-10 border border-white/10">

                {status === 'success' && (
                  <div className="mb-6">
                    <Alert type="success" message="Message sent successfully ! We’ll contact you shortly." />
                  </div>
                )}
                {status === 'error' && (
                  <div className="mb-6">
                    <Alert type="error" message={errorMessage || 'Something went wrong.'} />
                  </div>
                )}

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
                  <div className="grid md:grid-cols-2 gap-6">
                    <TextField
                      label="Full Name"
                      placeholder="Enter your name"
                      variant="dark"
                      required
                      {...form.register('name')}
                      error={form.formState.errors.name?.message}
                    />
                    <TextField
                      label="Email Address"
                      type="email"
                      placeholder="Enter your email"
                      variant="dark"
                      required
                      {...form.register('email')}
                      error={form.formState.errors.email?.message}
                    />
                  </div>

                  <TextField
                    label="Mobile Number"
                    placeholder="Enter your mobile number"
                    variant="dark"
                    required
                    {...form.register('mobile')}
                    error={form.formState.errors.mobile?.message}
                  />

                  <TextArea
                    label="Message"
                    rows={6}
                    placeholder="Enter your message"
                    variant="dark"
                    required
                    {...form.register('message')}
                    error={form.formState.errors.message?.message}
                  />

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="w-full !py-4 text-lg font-semibold shadow-lg shadow-purple-500/20 bg-brand-light hover:bg-brand-dark border-none"
                    >
                      {form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        FAQ SECTION 
      */}
      <section className="py-24 border-t border-white/5 bg-white/[0.02]">
        <div className="container-base max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Common Questions</h2>
            <p className="text-gray-400 text-lg">Everything you need to know about getting in touch.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[
              { q: "What is the typical response time?", a: "We aim to respond to all inquiries within 24 hours during business days." },
              { q: "Do you offer custom demos?", a: "Yes! You can schedule a personalized demo with our sales team." },
              { q: "Where is technical documentation?", a: "Documentation is available in the Customer Portal once you create an account." },
              { q: "How do I contact support?", a: "For existing customers, please use the support portal for faster resolution." },
            ].map((faq, i) => (
              <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-white/20 transition-colors">
                <h3 className="font-bold text-white text-lg mb-2">{faq.q}</h3>
                <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}