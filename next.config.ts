import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: './messages/en.json'
  }
});

const config: NextConfig = {
    reactStrictMode: true,
    typescript:{
      ignoreBuildErrors:true
    },
      experimental: {
    globalNotFound: true,
  },
     images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wwwbebfhojdhxynbuxbh.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default withNextIntl(config);