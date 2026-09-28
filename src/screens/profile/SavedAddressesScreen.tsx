import React from 'react';
import AddressSelectionScreen from '../checkout/AddressSelectionScreen';

// Reuses the Address Selection component in non-checkout mode for full CRUD management
export const SavedAddressesScreen = (props: any) => {
  return <AddressSelectionScreen {...props} route={{ ...props.route, params: { isCheckoutFlow: false } }} />;
};

export default SavedAddressesScreen;
