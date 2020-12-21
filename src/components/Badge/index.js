/* eslint-disable react/no-typos */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Bagde } from './styles';

export default function Badge({ name, stateIssue, onClickStateIssue }) {
  console.log(name, stateIssue, onClickStateIssue);
  return <Bagde onClick={() => onClickStateIssue(stateIssue)}>{name}</Bagde>;
}
Badge.PropTypes = {
  name: PropTypes.string,
  stateIssue: PropTypes.string,
  onClickStateIssue: PropTypes.func,
};
