export interface MapMouseEvent extends MapMouseWheelEvent {
  /**
   * An array of Shape and Feature objects that the mouse event occurred on.
   * Shape objects are editable, while Feature objects are not editable
   * and either reside in a VectorTileSource or represent a cluster point.
   * Clusters have the following properties:<br />
   * `cluster`: `boolean` - Indicates that the point is a cluster.
   * This will be set to true if Point object represents a cluster.
   * All other point objects are unlikely to have this value unless
   * a property with this same name was added to the Point property data from your app.<br />
   * `cluster_id`: `string` - A unique id for the cluster.<br />
   * `point_count`: `number` - The number of points inside the cluster.<br />
   * `point_count_abbreviated`: `string` - An abbreviated string version of the point count. i.e. `"10K"`
   */
  shapes?: Array<atlas.data.Feature<atlas.data.Geometry, any> | atlas.Shape>;
  /**
   * The geographical location of all touch points on the map.
   */
  position?: atlas.data.Position;
  /**
   * The pixel coordinate where the event occurred as an array of [x, y].
   */
  pixel?: atlas.Pixel;
  /**
   * The id of the layer the event is attached to.
   */
  layerId?: string;
}
