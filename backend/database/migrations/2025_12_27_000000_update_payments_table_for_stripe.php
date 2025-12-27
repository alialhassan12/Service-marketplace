<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            // Drop project_id if it exists (wrong relationship)
            if (Schema::hasColumn('payments', 'project_id')) {
                $table->dropColumn('project_id');
            }

            // Add provider_id if it doesn't exist
            if (!Schema::hasColumn('payments', 'provider_id')) {
                $table->foreignId('provider_id')->constrained('users')->onDelete('cascade')->after('client_id');
            }

            // Add job_id if it doesn't exist
            if (!Schema::hasColumn('payments', 'job_id')) {
                $table->foreignId('job_id')->nullable()->constrained('jobs')->onDelete('set null')->after('provider_id');
            }

            // Add Stripe fields if they don't exist
            if (!Schema::hasColumn('payments', 'stripe_payment_intent_id')) {
                $table->string('stripe_payment_intent_id')->nullable()->unique()->after('transaction_id');
            }

            if (!Schema::hasColumn('payments', 'stripe_charge_id')) {
                $table->string('stripe_charge_id')->nullable()->unique()->after('stripe_payment_intent_id');
            }

            // Add currency if it doesn't exist
            if (!Schema::hasColumn('payments', 'currency')) {
                $table->string('currency')->default('USD')->after('amount');
            }

            // Add description if it doesn't exist
            if (!Schema::hasColumn('payments', 'description')) {
                $table->text('description')->nullable()->after('currency');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            // Drop columns if they exist
            $columnsToCheck = ['stripe_payment_intent_id', 'stripe_charge_id', 'currency', 'description'];
            foreach ($columnsToCheck as $column) {
                if (Schema::hasColumn('payments', $column)) {
                    $table->dropColumn($column);
                }
            }

            // Drop foreign keys and columns
            if (Schema::hasColumn('payments', 'provider_id')) {
                $table->dropForeignIdFor(\App\Models\User::class, 'provider_id');
            }

            if (Schema::hasColumn('payments', 'job_id')) {
                $table->dropForeignIdFor(\App\Models\Job::class, 'job_id');
            }
        });
    }
};
