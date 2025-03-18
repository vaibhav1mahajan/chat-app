import Image from "next/image";

import { FC, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

const Button: FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const baseStyles = `inline-flex items-center justify-center font-semibold transition-colors rounded-full focus:outline-none`;

  const variantStyles = {
    primary: "bg-yellow-400 hover:bg-yellow-500 text-black",
    secondary: "bg-blue-500 hover:bg-blue-600 text-white",
    outline:
      "border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 items-center gap-12">
        {/* Left Content */}
        <div className="space-y-6">
          <h1 className="text-5xl font-bold leading-tight">
            Connect Instantly with{" "}
            <span className="text-yellow-400">ChatApp</span>
          </h1>
          <p className="text-lg opacity-80">
            Real-time messaging made easy. Experience seamless communication
            with rich features and an intuitive interface.
          </p>
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-full text-lg">
            Get Started
          </Button>
        </div>

        {/* Right Image  */}
        <div className="relative">
          <Image
            src="/chat-hero-image.png"
            alt="Chat app preview"
            width={700}
            height={450}
            className="rounded-lg shadow-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
