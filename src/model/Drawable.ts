export interface IDrawable {

}

export default abstract class Drawable {
  draw: () => IDrawable
}