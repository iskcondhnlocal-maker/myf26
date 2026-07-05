"use client";

import React from "react";

export default function TestimonialCarousel() {
  const testimonials = [
    {
      name: "Ashish – Graduation Student, PK Roy College | SSC Aspirant",
      quote: "Exam preparation ke beech motivation maintain karna kaafi difficult ho gaya tha. Mega Youth Festival ne mujhe sirf motivate nahi kiya, balki discipline aur consistency ke practical steps diye. Mentors se baat karke future ko lekar bhi kaafi clarity mili.",
      image: "/1. Ashish – Graduation Student, PK Roy College _ SSC Aspirant.png",
    },
    {
      name: "Harsh – 4th Year, Electrical Engineering, IIT (ISM) Dhanbad",
      quote: "Placement aur future ko lekar kaafi confusion tha. Yahan seniors se baat karke ek naya perspective mila. Sessions bahut practical the, aur event ke baad laga ki ab sirf degree nahi, apni life par bhi kaam karna hai.",
      image: "/2. Harsh – 4th Year, Electrical Engineering, IIT (ISM) Dhanbad.png",
    },
    {
      name: "Uttam – 2nd Year, KK Polytechnic, Dhanbad",
      quote: "Is event ki sabse achhi baat yeh lagi ki yahan koi judge nahi karta. Practical guidance, positive environment aur naye dost—yeh combination mujhe bahut pasand aaya. Main definitely next year bhi aaunga.",
      image: "/3. Uttam – 2nd Year, KK Polytechnic, Dhanbad.jpeg",
    },
    {
      name: "Roshan – 3rd Year MBBS, PMCH Dhanbad",
      quote: "Medical studies ke pressure ke beech yeh event ek refreshing experience tha. Sessions ne stress ko better handle karna sikhaya aur mentors se baat karke kaafi grounded feel hua. Din kaafi meaningful raha.",
      image: "/4. Roshan – 3rd Year MBBS, PMCH Dhanbad.png",
    },
    {
      name: "Rajesh – IIT-JEE Aspirant",
      quote: "Drop year mein consistency maintain karna mushkil tha. Mega Youth Festival ke practical sessions ne mujhe apna routine aur mindset improve karne mein help ki. Event ke baad dobara focused feel kar raha hoon.",
      image: "/5. Rajesh – IIT-JEE Aspirant.png",
    },
    {
      name: "Pavan – Teacher, D.Y. Patil School, Dhanbad",
      quote: "Office aur daily routine ke beech lag raha tha life bas chal rahi hai. Yahan aakar positive log mile, practical guidance mili aur apne personal growth par phir se kaam karne ki inspiration mili.",
      image: "/6. Pavan – Teacher, D.Y. Patil School, Dhanbad.png",
    },
    {
      name: "Shyam – IIT (ISM) Alumnus | Graduate Engineer Trainee, Tata Motors",
      quote: "Job aur competitive exam preparation ko balance karna kaafi challenging tha. Mega Youth Festival ne mujhe practical habits aur better time management ke ideas diye. Sabse valuable cheez mentors se personal guidance aur ek positive peer group mila.",
      image: "/7. Shyam – IIT (ISM) Alumnus _ Graduate Engineer Trainee, Tata Motors.png",
    },
    {
      name: "Pravin– HR Professional, BCCL",
      quote: "Mujhe laga tha ye ek normal seminar hoga, lekin experience usse kaafi alag tha. Practical sessions ke saath-saath ek positive community ka hissa banne ka mauka mila. Event ke baad laga ki growth aur aasaan ho jaati hai jab aas-paas sahi log hote hain.",
      image: "/8. Pravin– HR Professional, BCCL.png",
    }
  ];

  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="overflow-hidden py-8 font-body relative w-full">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="flex animate-marquee items-stretch w-max gap-6 px-4">
        {duplicatedTestimonials.map((testimonial, idx) => (
          <div key={idx} className="flex h-auto w-80 sm:w-96 flex-col gap-4 rounded-2xl bg-[var(--color-surface-container-low)] p-4 border border-[var(--color-outline-variant)]/20 shadow-lg shrink-0">
            <div
              className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
              data-alt={`Portrait of ${testimonial.name}`}
              style={{
                backgroundImage: `url('${testimonial.image}')`,
              }}
            ></div>
            <div className="px-2 flex flex-col justify-between flex-grow">
              <p className="text-white text-[15px] leading-relaxed italic mb-4">
                "{testimonial.quote}"
              </p>
              <p className="text-[var(--color-secondary)] text-sm font-bold mt-auto">
                — {testimonial.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
