// @flow
import React, { Component } from 'react'
import { partial } from 'lodash'
import { observer } from 'mobx-react'

import { dashboardInstance } from './lib'
import type { Point } from './lib'

@observer
export default class App extends Component<any, any> {
  handleAddPress = () => {
    dashboardInstance.createPoint({
      x: Math.floor(Math.random() * dashboardInstance.viewportWidth * dashboardInstance.scale) + 0,
      y: Math.floor(Math.random() * dashboardInstance.viewportHeight * dashboardInstance.scale) + 0
    })
  }

  renderContent () {
    const pointsDom = dashboardInstance.points.map((v: Point) => {
      const isActive = dashboardInstance.activePoints.includes(v)
      const className = isActive ? 'point active' : 'point'

      return (
        <g id={v.id}>
          <circle
            className={className}
            cx={v.x}
            cy={v.y}
            fill='#e45959'
            key={v.id}
            r='10'
            stroke='#e3e3e3'
            strokeWidth='1'
            onClick={partial(dashboardInstance.activatePoint, v)}
          />
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
        height={dashboardInstance.viewportHeight * dashboardInstance.scale}
        width={dashboardInstance.viewportWidth * dashboardInstance.scale}
      >
        {pointsDom}
        {vectorsDom}
      </svg>
    )
  }

  render () {
    return (
      <div className='container'>
        <div className='toolbox'>
          <button className='toolbox__item' onClick={this.handleAddPress}>+</button>
        </div>
        <div className='body'>
          {this.renderContent()}
        </div>
      </div>
    )
  }
}
