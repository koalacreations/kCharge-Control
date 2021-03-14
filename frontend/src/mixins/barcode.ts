/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export default {
  computed: {
    barcodeEnable(): boolean {
      return (
        (this.$q.platform.is.ios as boolean) ||
        (this.$q.platform.is.android as boolean) ||
        false
      );
    },
  }
};
