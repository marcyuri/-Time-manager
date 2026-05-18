import html2canvas from 'html2canvas'

export async function exportNodeAsPng(
  node,
  fileName = 'emploi-du-temps.png'
) {
  if (!node) return

  const grid = node.querySelector('.week-calendar__grid')
  const dayColumns = node.querySelectorAll('.day-column')
  const taskContainers = node.querySelectorAll('.day-column__tasks')

  const originalNodeStyle = {
    width: node.style.width,
    minWidth: node.style.minWidth,
    height: node.style.height,
    overflow: node.style.overflow,
  }

  const originalGridStyle = grid
    ? {
        display: grid.style.display,
        gridTemplateColumns: grid.style.gridTemplateColumns,
        width: grid.style.width,
        minWidth: grid.style.minWidth,
      }
    : null

  const originalDayStyles = Array.from(dayColumns).map((column) => ({
    column,
    height: column.style.height,
    maxHeight: column.style.maxHeight,
    overflow: column.style.overflow,
  }))

  const originalTaskStyles = Array.from(taskContainers).map((container) => ({
    container,
    height: container.style.height,
    maxHeight: container.style.maxHeight,
    overflow: container.style.overflow,
  }))

  const exportWidth = Math.max(
    node.scrollWidth,
    grid?.scrollWidth || 0,
    7 * 240 + 6 * 14 + 48
  )

  node.style.width = `${exportWidth}px`
  node.style.minWidth = `${exportWidth}px`
  node.style.height = 'auto'
  node.style.overflow = 'visible'

  if (grid) {
    grid.style.display = 'grid'
    grid.style.gridTemplateColumns = 'repeat(7, 240px)'
    grid.style.width = `${exportWidth}px`
    grid.style.minWidth = `${exportWidth}px`
  }

  dayColumns.forEach((column) => {
    column.style.height = 'auto'
    column.style.maxHeight = 'none'
    column.style.overflow = 'visible'
  })

  taskContainers.forEach((container) => {
    container.style.height = 'auto'
    container.style.maxHeight = 'none'
    container.style.overflow = 'visible'
  })

  await new Promise((resolve) => requestAnimationFrame(resolve))

  const finalWidth = Math.ceil(node.scrollWidth)
  const finalHeight = Math.ceil(node.scrollHeight)

  const canvas = await html2canvas(node, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#f8fafc',
    logging: false,
    width: finalWidth,
    height: finalHeight,
    windowWidth: finalWidth,
    windowHeight: finalHeight,
    scrollX: 0,
    scrollY: 0,
  
    ignoreElements: (element) => {
      return (
        element.classList?.contains('day-column__add') ||
        element.classList?.contains('task-card__actions') ||
        element.classList?.contains('task-card__drag')
      )
    },
  })

  node.style.width = originalNodeStyle.width
  node.style.minWidth = originalNodeStyle.minWidth
  node.style.height = originalNodeStyle.height
  node.style.overflow = originalNodeStyle.overflow

  if (grid && originalGridStyle) {
    grid.style.display = originalGridStyle.display
    grid.style.gridTemplateColumns = originalGridStyle.gridTemplateColumns
    grid.style.width = originalGridStyle.width
    grid.style.minWidth = originalGridStyle.minWidth
  }

  originalDayStyles.forEach(({ column, height, maxHeight, overflow }) => {
    column.style.height = height
    column.style.maxHeight = maxHeight
    column.style.overflow = overflow
  })

  originalTaskStyles.forEach(({ container, height, maxHeight, overflow }) => {
    container.style.height = height
    container.style.maxHeight = maxHeight
    container.style.overflow = overflow
  })

  const image = canvas.toDataURL('image/png')
  const link = document.createElement('a')

  link.href = image
  link.download = fileName
  link.click()
}