"use client";

import React, { useEffect, useRef } from "react";

export default function TestimonialCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  
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
      name: "Mritunjay – 3rd Year MBBS, PMCH Dhanbad",
      quote: "Medical studies ke pressure ke beech yeh event ek refreshing experience tha. Sessions ne stress ko handle karna sikhaya aur mentors se baat karke kaafi grounded feel hua. Din kaafi meaningful raha.",
      image: "/4. Mritunjay – 3rd Year MBBS, PMCH Dhanbad.png",
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

  useEffect(() => {
    let animationId: number;
    let isHovering = false;
    let currentX = 0;
    
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
    const wrapper = scrollContainer.querySelector('.scroll-wrapper') as HTMLElement;
    if (!wrapper) return;

    const scroll = () => {
      if (!isHovering) {
        currentX -= 1; // 1px per frame speed
        
        const firstChild = wrapper.firstElementChild as HTMLElement;
        if (firstChild) {
          // Calculate exact width including the gap (gap-6 = 24px)
          const style = window.getComputedStyle(firstChild);
          const margin = parseFloat(style.marginRight) || 0;
          const itemWidth = firstChild.offsetWidth + 24; // hardcode 24px gap for stability
          
          // Once scrolled past the first item
          if (Math.abs(currentX) >= itemWidth) {
            currentX += itemWidth; // snap back
            wrapper.appendChild(firstChild); // move first to last
          }
        }
        wrapper.style.transform = `translate3d(${currentX}px, 0, 0)`;
      }
      animationId = requestAnimationFrame(scroll);
    };
    
    animationId = requestAnimationFrame(scroll);
    
    const handleMouseEnter = () => isHovering = true;
    const handleMouseLeave = () => isHovering = false;
    const handleTouchStart = () => isHovering = true;
    const handleTouchEnd = () => {
      setTimeout(() => isHovering = false, 2000);
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);
    scrollContainer.addEventListener('touchstart', handleTouchStart);
    scrollContainer.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      cancelAnimationFrame(animationId);
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
        scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
        scrollContainer.removeEventListener('touchstart', handleTouchStart);
        scrollContainer.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, []);

  return (
    <div className="py-8 font-body relative w-full overflow-hidden" ref={scrollRef}>
      <div 
        className="scroll-wrapper flex items-stretch gap-6 px-4 w-max"
        style={{ willChange: 'transform' }}
      >
        {testimonials.map((testimonial, idx) => (
          <div key={idx} className="flex h-auto w-80 sm:w-96 flex-col gap-4 rounded-2xl bg-[var(--color-surface-container-low)] p-4 border border-[var(--color-outline-variant)]/20 shadow-lg shrink-0">
            <div
              className="w-full bg-top bg-no-repeat aspect-square bg-cover rounded-xl"
              data-alt={`Portrait of ${testimonial.name}`}
              style={{
                backgroundImage: `url('${testimonial.image}')`,
              }}
            ></div>
            <div className="px-2 flex flex-col justify-between flex-grow">
              <p className="text-white text-[15px] leading-relaxed italic mb-4 select-none pointer-events-none">
                "{testimonial.quote}"
              </p>
              <p className="text-[var(--color-secondary)] text-sm font-bold mt-auto select-none pointer-events-none">
                — {testimonial.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
