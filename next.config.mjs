const isDev = process.env.NODE_ENV !== 'production';

const nextConfig = {
  productionBrowserSourceMaps: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "assets.mixkit.co",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "cdn.razorpay.com",
      },
      {
        protocol: "https",
        hostname: "checkout.razorpay.com",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';

              script-src
                'self'
                ${isDev ? "'unsafe-inline' 'unsafe-eval'" : ''}
                https://checkout.razorpay.com
                https://cdn.razorpay.com
                https://www.google.com
                https://www.gstatic.com;

              style-src
                'self'
                'unsafe-inline'
                https://fonts.googleapis.com
                https://checkout.razorpay.com;

              font-src
                'self'
                data:
                https://fonts.gstatic.com;

              img-src
                'self'
                data:
                blob:
                https://images.unsplash.com
                https://assets.mixkit.co
                https://storage.googleapis.com
                https://firebasestorage.googleapis.com
                https://res.cloudinary.com
                https://cdn.razorpay.com
                https://api.razorpay.com
                https://checkout.razorpay.com;

              connect-src
                'self'
                ws://localhost:3000
                http://localhost:3000
                http://localhost:5000
                http://localhost:5001
                https://api.fameo.vip
                https://api.fameo.info
                https://uat-api.fameo.info
                https://uat.fameo.info
                https://prod.smartauth.co
                https://fameo-web-backend-production.up.railway.app
                wss://fameo-web-backend-production.up.railway.app
                https://api.emailjs.com
                https://storage.googleapis.com
                https://firebasestorage.googleapis.com
                https://res.cloudinary.com
                https://api.razorpay.com
                https://checkout.razorpay.com
                https://cdn.razorpay.com
                https://lumberjack.razorpay.com
                https://www.google.com
                https://www.gstatic.com;

              frame-src
                'self'
                https://checkout.razorpay.com
                https://api.razorpay.com
                https://cdn.razorpay.com
                https://www.google.com
                https://*.razorpay.com;

              media-src
                'self'
                https://assets.mixkit.co
                https://storage.googleapis.com
                https://firebasestorage.googleapis.com
                https://res.cloudinary.com
                https://videos.pexels.com
                https://commondatastorage.googleapis.com;

              worker-src
                'self'
                blob:;

              object-src 'none';

              base-uri 'self';

              form-action
                'self'
                https://api.razorpay.com
                https://checkout.razorpay.com;

              frame-ancestors 'none';
            `
              .replace(/\n/g, " ")
              .replace(/\s{2,}/g, " ")
              .trim(),
          },

          {
            key: "X-Frame-Options",
            value: "DENY",
          },

          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },

          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },

          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },

          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
