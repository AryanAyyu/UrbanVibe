import React, { useRef, useEffect } from "react";

export default function AutoScrollInfinite({ images }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const box = scrollRef.current;
    let speed = 1; // change speed here

    const scroll = () => {
      if (!box) return;

      box.scrollLeft += speed;

      // when 1st set ends → reset to start smoothly
      if (box.scrollLeft >= box.scrollWidth / 2) {
        box.scrollLeft = 0;
      }

      requestAnimationFrame(scroll);
    };

    scroll();
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <div
        ref={scrollRef}
        className="flex overflow-x-scroll whitespace-nowrap scrollbar-hide"
      >
        {/* ✅ duplicate images array to make infinite loop */}
        {[...images, ...images].map((img, i) => (
          <img
            key={i}
            src={img}
            className="h-64 w-[450px] object-cover rounded-xl mx-2"
            draggable="false"
          />
        ))}
      </div>
    </div>
  );
}