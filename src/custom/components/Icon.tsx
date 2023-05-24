import React from 'react';

import { classes } from '../utils/classes';

export default function Icon({ className, name }: { className?: string; name: string }) {
  return <span className={classes('material-symbols-outlined', className)}>{name}</span>;
}
