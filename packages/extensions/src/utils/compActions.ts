export const handleInputOf = (ctx: any) => (key: string) => (e: any) => {
  const { value } = e.currentTarget
  ctx.setState({
    [key]: value,
  })
}
