export function confirmAndDelete({ onDelete, itemLabel = 'item', protectIfOnly = 0, total = 1, toast }) {
    if (total <= protectIfOnly) {
      toast(`❌ You must have at least ${protectIfOnly} ${itemLabel}${protectIfOnly ? 's' : ''}.`);
      return;
    }
  
    const confirmed = window.confirm(`Are you sure you want to delete this ${itemLabel}?`);
    if (!confirmed) return;
  
    onDelete();
    toast(`🗑️ ${capitalize(itemLabel)} deleted`);
  }
  
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  