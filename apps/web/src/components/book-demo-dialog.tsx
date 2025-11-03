"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";

interface BookDemoDialogProps {
  trigger?: React.ReactNode;
}

export function BookDemoDialog({ trigger }: BookDemoDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    role: "",
    message: "",
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // TODO: Implement actual API call to save demo request
    console.log("Demo booking request:", formData);

    // Show success message (you can replace this with a toast notification)
    alert("Thank you! We'll contact you soon to schedule your demo.");

    // Close dialog and reset form
    setOpen(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      organization: "",
      role: "",
      message: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            size="lg"
            className="rounded-full bg-gradient-to-r from-indigo-600 via-sky-600 to-cyan-500 px-8 text-base font-semibold shadow-lg shadow-indigo-200 hover:from-indigo-500 hover:to-cyan-500"
          >
            <Calendar className="mr-2 h-5 w-5" />
            Book Demo
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-slate-900">
            Book a Demo
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Fill in your details and we'll get in touch to schedule a personalized demo of Thravi HMS.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Dr. John Smith"
              value={formData.name}
              onChange={handleChange}
              className="border-slate-300 focus:border-sky-500 focus:ring-sky-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="john.smith@hospital.com"
              value={formData.email}
              onChange={handleChange}
              className="border-slate-300 focus:border-sky-500 focus:ring-sky-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-slate-700">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
              className="border-slate-300 focus:border-sky-500 focus:ring-sky-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization" className="text-slate-700">
              Hospital/Clinic Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="organization"
              name="organization"
              type="text"
              required
              placeholder="City General Hospital"
              value={formData.organization}
              onChange={handleChange}
              className="border-slate-300 focus:border-sky-500 focus:ring-sky-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-slate-700">
              Your Role
            </Label>
            <Input
              id="role"
              name="role"
              type="text"
              placeholder="Hospital Administrator, Doctor, etc."
              value={formData.role}
              onChange={handleChange}
              className="border-slate-300 focus:border-sky-500 focus:ring-sky-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-slate-700">
              Additional Notes
            </Label>
            <textarea
              id="message"
              name="message"
              rows={3}
              placeholder="Tell us about your requirements..."
              value={formData.message}
              onChange={handleChange}
              className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-sky-600 to-indigo-600 text-white hover:from-sky-500 hover:to-indigo-500"
            >
              Submit Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
