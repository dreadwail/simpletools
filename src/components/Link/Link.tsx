import MaterialLink from '@material-ui/core/Link';
import { FC, forwardRef, ReactNode } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';

export type LinkProps = {
  readonly href: string;
  readonly children: ReactNode;
};

const ExternalLink = forwardRef<HTMLAnchorElement, LinkProps>(({ href, children }, ref) => (
  <MaterialLink ref={ref} href={href} rel="noreferrer" target="_blank">
    {children}
  </MaterialLink>
));

const InternalLink = forwardRef<HTMLAnchorElement, LinkProps>(({ href, children }, ref) => (
  <MaterialLink ref={ref} to={href} component={ReactRouterLink}>
    {children}
  </MaterialLink>
));

const Link: FC<LinkProps> = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  const { href } = props;

  const isExternal = href.startsWith('http');
  if (isExternal) {
    return <ExternalLink {...props} ref={ref} />;
  }

  return <InternalLink {...props} ref={ref} />;
});

export default Link;
