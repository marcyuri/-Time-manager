import html2canvas from "html2canvas"

export async function exportNodeAsPng(node, fileName = "emploi-du-temps.png") {
  if (!node) return

  const calendar = node
  const dayColumns = calendar.querySelectorAll(".day-column")
  const taskContainers = calendar.querySelectorAll(".day-column__tasks")

  const originalCalendarStyle = {
    width: calendar.style.width,
    height: calendar.style.height,
    maxHeight: calendar.style.maxHeight,
    overflow: calendar.style.overflow,
  }

  const originalDayStyles = Array.from(dayColumns).map((el) => ({
    el,
    height: el.style.height,
    minHeight: el.style.minHeight,
    maxHeight: el.style.maxHeight,
    overflow: el.style.overflow,
  }))

  const originalTaskStyles = Array.from(taskContainers).map((el) => ({
    el,
    height: el.style.height,
    maxHeight: el.style.maxHeight,
    overflow: el.style.overflow,
  }))

  calendar.style.width = `${calendar.scrollWidth}px`
  calendar.style.height = "auto"
  calendar.style.maxHeight = "none"
  calendar.style.overflow = "visible"

  dayColumns.forEach((el) => {
    el.style.height = "auto"
    el.style.minHeight = "560px"
    el.style.maxHeight = "none"
    el.style.overflow = "visible"
  })

  taskContainers.forEach((el) => {
    el.style.height = "auto"
    el.style.maxHeight = "none"
    el.style.overflow = "visible"
  })

  await new Promise((resolve) => requestAnimationFrame(resolve))

  const canvas = await html2canvas(calendar, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#f8fafc",
    logging: false,
    width: calendar.scrollWidth,
    height: calendar.scrollHeight,
    windowWidth: calendar.scrollWidth,
    windowHeight: calendar.scrollHeight,
    scrollX: 0,
    scrollY: 0,
  })

  calendar.style.width = originalCalendarStyle.width
  calendar.style.height = originalCalendarStyle.height
  calendar.style.maxHeight = originalCalendarStyle.maxHeight
  calendar.style.overflow = originalCalendarStyle.overflow

  originalDayStyles.forEach(({ el, height, minHeight, maxHeight, overflow }) => {
    el.style.height = height
    el.style.minHeight = minHeight
    el.style.maxHeight = maxHeight
    el.style.overflow = overflow
  })

  originalTaskStyles.forEach(({ el, height, maxHeight, overflow }) => {
    el.style.height = height
    el.style.maxHeight = maxHeight
    el.style.overflow = overflow
  })

  const image = canvas.toDataURL("image/png")

  const link = document.createElement("a")
  link.href = image
  link.download = fileName
  link.click()
}