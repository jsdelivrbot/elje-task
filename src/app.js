// @flow
import React, { Component } from 'react'
import { partial } from 'lodash'
import { observer } from 'mobx-react'

import { dashboardInstance } from './lib'
import type { Point } from './lib'

@observer
export default class App extends Component<any, any> {
  renderAnchor = (point: Point) => {
    if (dashboardInstance.activePoints.length === 0) return null

    const index = dashboardInstance.activePoints.indexOf(point)
    if (index > -1) {
      return (
        <text
          className='anchor'
          dy='.3em'
          fill='#fff'
          key={point.id}
          textAnchor='middle'
          x={point.x}
          y={point.y}
        >
          {index + 1}
        </text>
      )
    }
  };

  renderContent () {
    const pointsDom = dashboardInstance.points.map(v => {
      return (
        <g id={v.id}>
          <circle
            className='point'
            cx={v.x}
            cy={v.y}
            fill='#e45959'
            key={v.id}
            r='10'
            stroke='#e3e3e3'
            strokeWidth='1'
            onClick={partial(dashboardInstance.activatePoint, v)}
          />
          {this.renderAnchor(v)}
        </g>
      )
    })

    const vectorsDom = dashboardInstance.vectors.map(v => {
      return (
        <line
          className='vector'
          key={v.id}
          stroke='#9e7dec'
          strokeWidth='2'
          x1={v.startX}
          x2={v.endX}
          y1={v.startY}
          y2={v.endY}
          onClick={partial(dashboardInstance.removeVector, v.id)}
        />
      )
    })

    return (
      <svg
        height={dashboardInstance.viewportHeight}
        width={dashboardInstance.viewportWidth}
      >
        {pointsDom}
        {vectorsDom}
      </svg>
    )
  }

  render () {
    return (
      <div className='container'>
        <div className='toolbox' />
        <div className='body'>
          {this.renderContent()}
        </div>
      </div>
    )
  }
}
