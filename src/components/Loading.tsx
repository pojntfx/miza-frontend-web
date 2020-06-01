import * as React from "react";
import { Transition } from "react-spring/renderprops";
import { SyncLoader } from "react-spinners";
import { LoaderSizeProps } from "react-spinners/interfaces";

interface ILoadingProps {
  loading?: boolean;
}

export const Loading: React.FC<ILoadingProps> = ({
  loading,
  ...otherProps
}) => (
  <Transition
    items={loading}
    from={{ opacity: 0 }}
    enter={{ opacity: 1 }}
    leave={{ opacity: 0 }}
    {...otherProps}
  >
    {(loading) =>
      loading &&
      ((props) => (
        <SyncLoader
          color="#ff6a00"
          size={7.5}
          loading={loading}
          css={(props as unknown) as LoaderSizeProps["css"]}
        />
      ))
    }
  </Transition>
);
