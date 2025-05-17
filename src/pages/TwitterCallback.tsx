import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const TwitterCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Get the code and state parameters from the URL
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    if (code && state && window.opener) {
      // Send the code and state back to the opener window
      window.opener.postMessage(
        {
          type: 'TWITTER_AUTH_CALLBACK',
          code,
          state
        },
        window.location.origin
      );
      
      // Close this popup window after sending the message
      window.close();
    }
  }, [searchParams]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-space-black">
      <p className="text-nixo-green text-lg">Processing login, please wait...</p>
    </div>
  );
};

export default TwitterCallback;