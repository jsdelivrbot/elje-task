// @flow
import React, { Component } from 'react'
import { partial } from 'lodash'
import { observer } from 'mobx-react'

import type { Point } from './lib'
import { Dashboard } from './lib'
import Instruction from './instuction'

type Props = {
  dashboard: Dashboard
};

type State = {};

@observer
export default class App extends Component<Props, State> {
  handleAddPress = () => {
    this.props.dashboard.createPoint({
      x: Math.floor(Math.random() * 1000) + 0, // random 0-1000, Proof of work for scaling
      y: Math.floor(Math.random() * 1000) + 0
    })
  };

  handleRemovePress = () => {
    const activePoints = this.props.dashboard.activePoints
    if (activePoints.length) {
      this.props.dashboard.removePoint(activePoints[0].id)
    }
  };

  renderContent () {
    const scale = this.props.dashboard.scale
    const pointsDom = this.props.dashboard.points.map((v: Point) => {
      const isActive = this.props.dashboard.activePoints.includes(v)
      const activeClass = isActive ? 'active' : 'point'
      const scaleRadius = scale < 1 ? scale < 0.5 ? 3 : 6 : 10

      return (
        <circle
          className={`point ${activeClass}`}
          cx={v.x * this.props.dashboard.scale}
          cy={v.y * this.props.dashboard.scale}
          fill='#e45959'
          key={v.id}
          r={scaleRadius}
          stroke='#e3e3e3'
          strokeWidth='1'
          onClick={partial(this.props.dashboard.activatePoint, v)}
        />
      )
    })

    const vectorsDom = this.props.dashboard.vectors.map(v => {
      return (
        <line
          className='vector'
          key={v.id}
          stroke='#9e7dec'
          strokeWidth='2'
          x1={v.startX * this.props.dashboard.scale}
          x2={v.endX * this.props.dashboard.scale}
          y1={v.startY * this.props.dashboard.scale}
          y2={v.endY * this.props.dashboard.scale}
          onClick={partial(this.props.dashboard.removeVector, v.id)}
        />
      )
    })

    return (
      <svg
        height={this.props.dashboard.viewportHeight + 5} // need margin
        width={this.props.dashboard.viewportWidth + 5}
      >
        {pointsDom}
        {vectorsDom}
      </svg>
    )
  }

  render () {
    const scale = this.props.dashboard.scale
    const hasActivePoints = this.props.dashboard.activePoints.length > 0
    const bodyClass = scale < 1
      ? scale < 0.5 ? 'body xsmall' : 'body small'
      : 'body'

    // need to extract toolbox body components
    // maybenexttime
    return (
      <div className='container'>
        <div className='toolbox'>
          <button className='toolbox__item' onClick={this.handleAddPress}>
            +
          </button>
          <button
            className='toolbox__item'
            disabled={!hasActivePoints}
            onClick={this.handleRemovePress}
          >
            ✖
          </button>
        </div>
        <div className={bodyClass}>
          {this.renderContent()}
        </div>
        <Instruction />
      </div>
    )
  }
}
