import * as React from "react";
import GoogleLogin from "react-google-login";

export interface ILoginProviderProps {
  googleClientId: string;
  children: (data: ILoginProviderDataProps) => React.ReactElement;
}

export interface ILoginProviderDataProps {
  token: string;
}

export const LoginProvider: React.FC<ILoginProviderProps> = ({
  googleClientId,
  children,
  ...otherProps
}) => {
  const [token, setToken] = React.useState("");

  return token ? (
    children({ token, ...otherProps })
  ) : (
    <GoogleLogin
      onSuccess={(res) => setToken((res as any).tokenId)}
      onFailure={(e) => console.error(e)}
      clientId={googleClientId}
      isSignedIn
      {...otherProps}
    />
  );
};
