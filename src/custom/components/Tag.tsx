import React from 'react';

import { classes } from '../utils/classes';

import './Tag.scss';

type Props = {
  color?: string;
  value: any;
};

const Tag: React.FC<Props> = ({ color, value }: Props) => {
  return <span className={classes('tag', color && `tag--${color}`)}>{value}</span>;
};

export default Tag;
