import { SendEmail } from "./Header"

const Fb = () => <svg className="h-6 w-6" width="18" height="33" viewBox="0 0 18 33" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M16.4459 18.5L17.3349 12.709H11.7779V8.95101C11.7779 7.36701 12.5539 5.82201 15.0429 5.82201H17.5689V0.892007C17.5689 0.892007 15.2769 0.501007 13.0849 0.501007C8.50891 0.501007 5.51791 3.27501 5.51791 8.29601V12.71H0.430908V18.501H5.51791V32.501H11.7779V18.501L16.4459 18.5Z" fill="currentColor" />
</svg>

export const Ig = ({ className = "h-6 w-6" }: { className?: string}) => <svg className={className} width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" clipRule="evenodd" d="M7.465 1.566C8.638 1.512 9.012 1.5 12 1.5C14.988 1.5 15.362 1.513 16.534 1.566C17.706 1.619 18.506 1.806 19.206 2.077C19.939 2.354 20.604 2.787 21.154 3.347C21.714 3.896 22.146 4.56 22.422 5.294C22.694 5.994 22.88 6.794 22.934 7.964C22.988 9.139 23 9.513 23 12.5C23 15.488 22.987 15.862 22.934 17.035C22.881 18.205 22.694 19.005 22.422 19.705C22.146 20.4391 21.7133 21.1042 21.154 21.654C20.604 22.214 19.939 22.646 19.206 22.922C18.506 23.194 17.706 23.38 16.536 23.434C15.362 23.488 14.988 23.5 12 23.5C9.012 23.5 8.638 23.487 7.465 23.434C6.295 23.381 5.495 23.194 4.795 22.922C4.06092 22.646 3.39582 22.2133 2.846 21.654C2.28638 21.1047 1.85331 20.4399 1.577 19.706C1.306 19.006 1.12 18.206 1.066 17.036C1.012 15.861 1 15.487 1 12.5C1 9.512 1.013 9.138 1.066 7.966C1.119 6.794 1.306 5.994 1.577 5.294C1.85372 4.56008 2.28712 3.89531 2.847 3.346C3.39604 2.7865 4.06047 2.35344 4.794 2.077C5.494 1.806 6.294 1.62 7.464 1.566H7.465ZM16.445 3.546C15.285 3.493 14.937 3.482 12 3.482C9.063 3.482 8.715 3.493 7.555 3.546C6.482 3.595 5.9 3.774 5.512 3.925C4.999 4.125 4.632 4.362 4.247 4.747C3.88205 5.10205 3.60118 5.53428 3.425 6.012C3.274 6.4 3.095 6.982 3.046 8.055C2.993 9.215 2.982 9.563 2.982 12.5C2.982 15.437 2.993 15.785 3.046 16.945C3.095 18.018 3.274 18.6 3.425 18.988C3.601 19.465 3.882 19.898 4.247 20.253C4.602 20.618 5.035 20.899 5.512 21.075C5.9 21.226 6.482 21.405 7.555 21.454C8.715 21.507 9.062 21.518 12 21.518C14.938 21.518 15.285 21.507 16.445 21.454C17.518 21.405 18.1 21.226 18.488 21.075C19.001 20.875 19.368 20.638 19.753 20.253C20.118 19.898 20.399 19.465 20.575 18.988C20.726 18.6 20.905 18.018 20.954 16.945C21.007 15.785 21.018 15.437 21.018 12.5C21.018 9.563 21.007 9.215 20.954 8.055C20.905 6.982 20.726 6.4 20.575 6.012C20.375 5.499 20.138 5.132 19.753 4.747C19.3979 4.38207 18.9657 4.10121 18.488 3.925C18.1 3.774 17.518 3.595 16.445 3.546ZM10.595 15.891C11.3797 16.2176 12.2534 16.2617 13.0669 16.0157C13.8805 15.7697 14.5834 15.2489 15.0556 14.5422C15.5278 13.8356 15.7401 12.9869 15.656 12.1411C15.572 11.2953 15.197 10.505 14.595 9.905C14.2112 9.52148 13.7472 9.22781 13.2363 9.04515C12.7255 8.86248 12.1804 8.79536 11.6405 8.84862C11.1006 8.90187 10.5792 9.07418 10.1138 9.35313C9.64845 9.63208 9.25074 10.0107 8.9493 10.4619C8.64786 10.913 8.45019 11.4253 8.37052 11.962C8.29084 12.4986 8.33115 13.0463 8.48854 13.5655C8.64593 14.0847 8.91648 14.5626 9.28072 14.9647C9.64496 15.3668 10.0938 15.6832 10.595 15.891ZM8.002 8.502C8.52702 7.97697 9.15032 7.5605 9.8363 7.27636C10.5223 6.99222 11.2575 6.84597 12 6.84597C12.7425 6.84597 13.4777 6.99222 14.1637 7.27636C14.8497 7.5605 15.473 7.97697 15.998 8.502C16.523 9.02702 16.9395 9.65032 17.2236 10.3363C17.5078 11.0223 17.654 11.7575 17.654 12.5C17.654 13.2425 17.5078 13.9777 17.2236 14.6637C16.9395 15.3497 16.523 15.973 15.998 16.498C14.9377 17.5583 13.4995 18.154 12 18.154C10.5005 18.154 9.06234 17.5583 8.002 16.498C6.94166 15.4377 6.34597 13.9995 6.34597 12.5C6.34597 11.0005 6.94166 9.56234 8.002 8.502ZM18.908 7.688C19.0381 7.56527 19.1423 7.41768 19.2143 7.25397C19.2863 7.09027 19.3248 6.91377 19.3274 6.73493C19.33 6.55609 19.2967 6.37855 19.2295 6.21281C19.1622 6.04707 19.0624 5.89651 18.936 5.77004C18.8095 5.64357 18.6589 5.54376 18.4932 5.47652C18.3275 5.40928 18.1499 5.37598 17.9711 5.37858C17.7922 5.38119 17.6157 5.41965 17.452 5.4917C17.2883 5.56374 17.1407 5.6679 17.018 5.798C16.7793 6.05103 16.6486 6.38712 16.6537 6.73493C16.6588 7.08274 16.7992 7.41488 17.0452 7.66084C17.2911 7.90681 17.6233 8.04723 17.9711 8.0523C18.3189 8.05737 18.655 7.92669 18.908 7.688Z" fill="currentColor" />
</svg>

const Footer = ({ }) => {

  return <div className="md:grid gap-8 md:grid-cols-[7fr,5fr] lg:grid-cols-[8fr,4fr] flex-row flex-grow-0 py-8 px-4 md:px-0 justify-between text-gray-400 items-center container mx-auto">
    <div className="flex justify-between items-center md:block">
      FUTUR PROCHE
      <div className="flex gap-4 flex-row mt-0 md:mt-2">
        <a className="hover:text-brand" href="https://facebook.com" rel="noreferrer" target="_blank">
          <Fb />
        </a>
        <a className="hover:text-brand" href="https://instagram.com" rel="noreferrer" target="_blank">
          <Ig />
        </a>
        <SendEmail />
      </div>
    </div>
    <div>
      28 boulevard du pont d&apos;arve 
      <br />
      1205 Genève
      <br />
      <a className="hover:text-brand" href="mailto:info@futurproche.ch">info@futurproche.ch</a>
      <br />
      <a className="hover:text-brand" href="tel:+393287312924">+39 3287312924</a>
    </div>
  </div>
}

export default Footer