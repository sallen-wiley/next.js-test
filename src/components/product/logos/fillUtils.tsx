import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

type FillableElementProps = {
  children?: ReactNode;
  fill?: string;
};

export function forceLogoFillColor(node: ReactNode, fill: string): ReactNode {
  if (!isValidElement<FillableElementProps>(node)) {
    return node;
  }

  const element = node as ReactElement<FillableElementProps>;
  const children = Children.map(element.props.children, (child) =>
    forceLogoFillColor(child, fill),
  );

  return cloneElement(element, {
    ...element.props,
    fill,
    children,
  });
}
