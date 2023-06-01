import React, { useRef, useEffect } from 'react';

import { Fancybox as NativeFancybox } from '@fancyapps/ui';

function Fancybox(props) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const delegate = props.delegate || '[data-fancybox]';
    const options = props.options || {};

    NativeFancybox.bind(container, delegate, options);

    return () => {
      NativeFancybox.unbind(container);
      NativeFancybox.close();
    };
  });

  return (
    <div ref={containerRef}>
      <div
        className="z-[1051] fixed top-4 right-6 cursor-pointer closer"
        onClick={() => NativeFancybox.close()}
      >
        <style jsx>
          {`
            :global(.with-fancybox) .closer {
              opacity: 1;
              pointer-events: auto;
            }
            .closer {
              opacity: 0;
              transition: opacity 0.1s ease-in-out;
              pointer-events: none;
            }
          `}
        </style>
        fechar
      </div>
      {props.children}
    </div>
  );
}

export default Fancybox;
