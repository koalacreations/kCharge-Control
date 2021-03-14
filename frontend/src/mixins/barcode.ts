/* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/ban-ts-comment */
// ^ kind of gross but needed as this mixin will work correctly once imported into a component
export default {
  computed: {
    barcodeEnable(): boolean {
      return (
        // @ts-ignore
        (this.$q.platform.is.ios as boolean) || (this.$q.platform.is.android as boolean) || false
      );
    },
  }
};
