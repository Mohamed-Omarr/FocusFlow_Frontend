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
    }
};

export default withNextIntl(config);